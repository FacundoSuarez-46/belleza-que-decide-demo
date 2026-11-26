import { existsSync, readFileSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";
import OpenAI from "openai";

const aqui = dirname(fileURLToPath(import.meta.url));
const envArchivo = join(aqui, ".env");
if (existsSync(envArchivo)) {
  for (const linea of readFileSync(envArchivo, "utf8").split("\n")) {
    const corte = linea.match(/^([A-Z0-9_]+)=(.*)$/);
    if (corte && !process.env[corte[1]]) process.env[corte[1]] = corte[2].trim();
  }
}

const raiz = join(aqui, "..");
const origenes = new Set((process.env.GUIA_ORIGENES || "http://127.0.0.1:4173,http://localhost:4173").split(",").map((s) => s.trim()).filter(Boolean));
const limiteMinuto = Number(process.env.GUIA_LIMITE_MINUTO || 8);
const limiteDia = Number(process.env.GUIA_LIMITE_DIA || 80);
const modelo = process.env.OPENAI_MODEL || "gpt-4.1-mini";
const puerto = Number(process.env.PORT || 8787);

const porMinuto = new Map();
const porDia = new Map();
let catalogoCache = { mtime: 0, items: [] };

function catalogo() {
  const archivo = join(raiz, "ofertas.js");
  const mtime = statSync(archivo).mtimeMs;
  if (mtime !== catalogoCache.mtime) {
    const sandbox = { window: {} };
    vm.runInNewContext(readFileSync(archivo, "utf8"), sandbox, { filename: "ofertas.js" });
    catalogoCache = {
      mtime,
      items: (sandbox.window.OFERTAS || []).map((item) => ({
        id: item.id,
        nombre: item.nombre,
        grupo: item.grupo,
        campana: Boolean(item.campana)
      }))
    };
  }
  return catalogoCache.items;
}

function ipDe(req) {
  const fwd = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim();
  return fwd || req.socket.remoteAddress || "local";
}

function permitido(clave, mapa, max, ventana) {
  const ahora = Date.now();
  const slot = mapa.get(clave) || [];
  const vivos = slot.filter((t) => ahora - t < ventana);
  if (vivos.length >= max) return false;
  vivos.push(ahora);
  mapa.set(clave, vivos);
  return true;
}

function cors(req, res) {
  const origen = req.headers.origin || "";
  if (origenes.has(origen)) {
    res.setHeader("Access-Control-Allow-Origin", origen);
    res.setHeader("Vary", "Origin");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, X-Guia-Sesion");
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  }
}

function leerCuerpo(req) {
  return new Promise((resolve, reject) => {
    let crudo = "";
    req.on("data", (buf) => {
      crudo += buf;
      if (crudo.length > 12000) {
        reject(new Error("grande"));
        req.destroy();
      }
    });
    req.on("end", () => resolve(crudo));
    req.on("error", reject);
  });
}

const esquema = {
  type: "object",
  additionalProperties: false,
  properties: {
    mensaje: { type: "string" },
    chips: { type: "array", items: { type: "string" } },
    productos: { type: "array", items: { type: "string" } },
    accion: { type: "string", enum: ["ninguna", "experiencia", "sumate", "whatsapp"] },
    estado: {
      type: "object",
      additionalProperties: false,
      properties: {
        intencion: { type: "string" },
        espera: { type: "string" },
        para: { type: "string" },
        aroma: { type: "string" },
        lugar: { type: "string" },
        presupuesto: { type: "string" },
        categoria: { type: "string" }
      },
      required: ["intencion", "espera", "para", "aroma", "lugar", "presupuesto", "categoria"]
    }
  },
  required: ["mensaje", "chips", "productos", "accion", "estado"]
};

function instrucciones(items) {
  return [
    "Sos la guía virtual de Belleza que Decide, en Young, Uruguay. No sos Silvia. Hablás en español rioplatense, con voseo, cálida y breve.",
    "Solo respondés sobre este negocio: experiencias gratuitas, productos del catálogo, regalos, envíos, pagos y el kit para empezar.",
    "Si te piden código, tareas generales, diagnósticos médicos o datos internos, decliná y volvé a estos temas.",
    "No inventes precios, ingredientes, promociones, disponibilidad ni propiedades cosméticas. No prometas ganancias ni confirmes un horario.",
    "El facial es individual, 45 minutos, gratuito, en la oficina. Con amigas: 2 a 6 personas, de una hora a una hora y media, oficina o casa, sin obligación de compra.",
    "Anfitriona: regalo de bienvenida y un beneficio según las ventas, sin porcentaje publicado.",
    "Kit: $ 1.000, productos por $ 5.490, catálogo y dos folletos. Capacitación sin costo. Sin pedido mensual obligatorio. No es una ganancia.",
    "Envíos a todo el país. Desde 2.000 pesos el envío no se cobra. Pago con tarjeta, transferencia o depósito. Si el frasco se rompe o el producto no sale, la empresa lo cambia.",
    "Solo podés citar ids que estén en el catálogo. Prohibido decir que un producto es floral, dulce, fresco, intenso, de uso diario o de ocasión: ese dato no existe. Si preguntan por un aroma, decí que no está publicado y mostrá fragancias para mirar, sin asignarles una familia. No menciones marcas de terceros. Máximo 3 productos.",
    "Catálogo vigente: " + JSON.stringify(items),
    "Devolvé el estado conversacional actualizado. Si la persona quiere hablar con alguien, accion debe ser whatsapp."
  ].join("\n");
}

const cliente = process.env.OPENAI_API_KEY ? new OpenAI() : null;

const server = createServer(async (req, res) => {
  cors(req, res);
  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }
  if (req.method === "GET" && req.url === "/salud") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ok: true, modelo: Boolean(cliente) }));
    return;
  }
  if (req.method !== "POST" || req.url !== "/v1/guia") {
    res.writeHead(404);
    res.end();
    return;
  }
  if (!cliente) {
    res.writeHead(503, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "sin-configuracion" }));
    return;
  }
  const quien = ipDe(req);
  const sesion = String(req.headers["x-guia-sesion"] || quien).slice(0, 80);
  if (!permitido(quien, porMinuto, limiteMinuto, 60_000) || !permitido(sesion, porDia, limiteDia, 86_400_000)) {
    res.writeHead(429, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "limite" }));
    return;
  }
  let cuerpo;
  try {
    cuerpo = JSON.parse(await leerCuerpo(req));
  } catch (err) {
    res.writeHead(400);
    res.end();
    return;
  }
  const texto = String(cuerpo.texto || "").replace(/[<>]/g, "").slice(0, 400);
  if (!texto) {
    res.writeHead(400);
    res.end();
    return;
  }
  const hilo = Array.isArray(cuerpo.hilo) ? cuerpo.hilo.slice(-8) : [];
  const input = hilo
    .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .map((m) => ({ role: m.role, content: m.content.slice(0, 400) }));
  if (!input.length || input[input.length - 1].content !== texto) input.push({ role: "user", content: texto });
  const items = catalogo();
  const ids = new Set(items.map((item) => item.id));
  try {
    const respuesta = await cliente.responses.create({
      model: modelo,
      store: false,
      max_output_tokens: 450,
      instructions: instrucciones(items),
      input,
      text: { format: { type: "json_schema", name: "guia", strict: true, schema: esquema } }
    });
    const dato = JSON.parse(respuesta.output_text || "{}");
    dato.productos = (dato.productos || []).filter((id) => ids.has(id)).slice(0, 3);
    dato.chips = (dato.chips || []).map((c) => String(c).slice(0, 48)).slice(0, 5);
    dato.mensaje = String(dato.mensaje || "").slice(0, 700);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(dato));
  } catch (err) {
    const codigo = err && err.status === 429 ? 429 : 502;
    res.writeHead(codigo, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "servicio" }));
  }
});

server.listen(puerto, "127.0.0.1", () => {
  process.stdout.write("guia en 127.0.0.1:" + puerto + "\n");
});
