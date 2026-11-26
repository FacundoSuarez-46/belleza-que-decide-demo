/* Guía de belleza. La interfaz no habla con OpenAI: solo con el servidor local o con el motor del sitio. */
(function () {
  var CLAVE = "bqd-guia-sesion";
  var metaApi = document.querySelector('meta[name="bqd-guia-api"]');
  var API = (metaApi && metaApi.content) || "http://127.0.0.1:8787";
  var modo = "mock";
  var abierto = false;
  var previo = null;
  var turno = 0;
  var estado = {};
  var hilo = [];

  function local() {
    return location.hostname === "localhost" || location.hostname === "127.0.0.1";
  }
  function limpiar(texto) {
    return String(texto || "").replace(/[<>]/g, "").replace(/\b[\w.+-]+@[\w.-]+\b/g, "").replace(/\b\d{8,}\b/g, "").trim();
  }
  function guardar() {
    try {
      sessionStorage.setItem(CLAVE, JSON.stringify({ estado: estado, hilo: hilo.slice(-16), modo: modo }));
    } catch (err) {}
  }
  function leer() {
    try {
      var dato = JSON.parse(sessionStorage.getItem(CLAVE) || "null");
      if (!dato) return;
      estado = dato.estado || {};
      hilo = dato.hilo || [];
      if (dato.modo === "mock" || dato.modo === "openai") modo = dato.modo;
    } catch (err) {}
  }
  function sesion() {
    var id = "";
    try { id = sessionStorage.getItem("bqd-guia-id") || ""; } catch (err) {}
    if (!id) {
      id = Math.random().toString(36).slice(2);
      try { sessionStorage.setItem("bqd-guia-id", id); } catch (err) {}
    }
    return id;
  }

  var raiz = document.createElement("div");
  raiz.className = "asistente";
  raiz.innerHTML = [
    '<button type="button" class="asistente-lanzador" id="asistente-lanzador" aria-expanded="false" aria-controls="asistente-panel">',
    (window.BQD && BQD.icono ? BQD.icono("sparkles") : ""),
    '<span>¿Te ayudo?</span></button>',
    '<section class="asistente-panel" id="asistente-panel" role="dialog" aria-modal="false" aria-labelledby="asistente-titulo" hidden>',
    '<header class="asistente-cabeza">',
    '<span class="asistente-avatar" aria-hidden="true"></span>',
    '<div><p id="asistente-titulo">Tu guía de belleza</p><p class="asistente-sub" id="asistente-sub">Asistente virtual</p></div>',
    '<div class="asistente-controles">',
    '<button type="button" data-acc="restart" aria-label="Comenzar de nuevo"></button>',
    '<button type="button" data-acc="minus" aria-label="Minimizar"></button>',
    '<button type="button" data-acc="x" aria-label="Cerrar"></button>',
    '</div></header>',
    '<div class="asistente-log" id="asistente-log"></div>',
    '<div class="asistente-vivo" aria-live="polite" id="asistente-vivo"></div>',
    '<form class="asistente-form" id="asistente-form">',
    '<label class="sr" for="asistente-input">Escribí tu consulta</label>',
    '<input id="asistente-input" name="consulta" maxlength="400" autocomplete="off" placeholder="Escribí lo que estás buscando">',
    '<button type="submit" aria-label="Enviar"></button>',
    '</form></section>'
  ].join("");
  document.body.appendChild(raiz);
  if (window.BQD && BQD.icono) {
    raiz.querySelector(".asistente-avatar").innerHTML = BQD.icono("sparkles");
    raiz.querySelector('[data-acc="restart"]').innerHTML = BQD.icono("restart");
    raiz.querySelector('[data-acc="minus"]').innerHTML = BQD.icono("minus");
    raiz.querySelector('[data-acc="x"]').innerHTML = BQD.icono("x");
    raiz.querySelector(".asistente-form button").innerHTML = BQD.icono("send");
  }
  var panel = raiz.querySelector("#asistente-panel");
  var log = raiz.querySelector("#asistente-log");
  var vivo = raiz.querySelector("#asistente-vivo");
  var form = raiz.querySelector("#asistente-form");
  var input = raiz.querySelector("#asistente-input");
  var lanzador = raiz.querySelector("#asistente-lanzador");
  var sub = raiz.querySelector("#asistente-sub");

  function notaModo() {
    if (modo === "openai") sub.textContent = "Asistente virtual · la consulta se procesa con un servicio de IA";
    else if (modo === "fallback") sub.textContent = "Guía del sitio · el servicio de IA no está disponible";
    else sub.textContent = "Asistente virtual · versión de demostración, sin un modelo en vivo";
  }

  function burbuja(de, texto) {
    var art = document.createElement("article");
    art.className = "asistente-msg es-" + de;
    var p = document.createElement("p");
    p.textContent = texto;
    art.appendChild(p);
    log.appendChild(art);
    log.scrollTop = log.scrollHeight;
    if (de === "guia") vivo.textContent = texto;
  }

  function chips(lista, cont) {
    if (!lista || !lista.length) return;
    var caja = document.createElement("div");
    caja.className = "asistente-chips";
    lista.forEach(function (texto) {
      var b = document.createElement("button");
      b.type = "button";
      b.textContent = texto;
      b.addEventListener("click", function () { enviar(texto); });
      caja.appendChild(b);
    });
    (cont || log).appendChild(caja);
  }

  function tarjetas(ids) {
    if (!ids || !ids.length || !window.OFERTAS) return;
    var caja = document.createElement("div");
    caja.className = "asistente-cards";
    ids.forEach(function (id) {
      var item = window.OFERTAS.filter(function (p) { return p.id === id; })[0];
      if (!item) return;
      var card = document.createElement("article");
      card.className = "asistente-card";
      var img = document.createElement("img");
      img.src = item.img;
      img.alt = "";
      var cuerpo = document.createElement("div");
      var nombre = document.createElement("strong");
      nombre.textContent = item.nombre;
      var cat = document.createElement("span");
      cat.textContent = item.campana ? "Campaña" : (item.kicker || item.grupo || "");
      var ver = document.createElement("a");
      ver.href = "./tocador.html?pieza=" + encodeURIComponent(item.id) + "#vitrina";
      ver.textContent = "Ver detalles";
      var wa = document.createElement("a");
      wa.target = "_blank";
      wa.rel = "noopener";
      wa.href = window.BQD.wa("¡Hola! Estuve visitando Belleza que Decide y me interesa conocer más sobre " + item.nombre + ". ¿Podrías asesorarme?");
      wa.textContent = "Consultar";
      cuerpo.appendChild(nombre);
      cuerpo.appendChild(cat);
      cuerpo.appendChild(ver);
      cuerpo.appendChild(wa);
      card.appendChild(img);
      card.appendChild(cuerpo);
      caja.appendChild(card);
      if (estado.productos.indexOf(item.id) === -1) estado.productos.push(item.id);
    });
    if (caja.childNodes.length) log.appendChild(caja);
    log.scrollTop = log.scrollHeight;
  }

  function vistaWhatsapp() {
    var caja = document.createElement("form");
    caja.className = "asistente-wa";
    var t = document.createElement("p");
    t.textContent = "Continuá con Silvia. Revisá el mensaje antes de abrirlo.";
    var area = document.createElement("textarea");
    area.value = window.BQDMotor.resumen(estado);
    var abrir = document.createElement("a");
    abrir.className = "btn";
    abrir.target = "_blank";
    abrir.rel = "noopener";
    abrir.textContent = "Abrir WhatsApp";
    function enlace() { abrir.href = window.BQD.wa(area.value); }
    enlace();
    area.addEventListener("input", enlace);
    var volver = document.createElement("button");
    volver.type = "button";
    volver.className = "text-link";
    volver.textContent = "Volver al asistente";
    volver.addEventListener("click", function () { caja.remove(); input.focus(); });
    caja.appendChild(t);
    caja.appendChild(area);
    caja.appendChild(abrir);
    caja.appendChild(volver);
    caja.addEventListener("submit", function (ev) { ev.preventDefault(); });
    log.appendChild(caja);
    log.scrollTop = log.scrollHeight;
  }

  function pintarHilo() {
    log.innerHTML = "";
    hilo.forEach(function (m) {
      burbuja(m.de, m.texto);
      if (m.productos) tarjetas(m.productos);
      if (m.chips) chips(m.chips);
    });
  }

  function saludar(tema) {
    if (hilo.length) { pintarHilo(); return; }
    var texto = "Hola. Soy tu guía virtual de belleza, no soy Silvia. Puedo ayudarte a mirar lo que está publicado: productos de este mes, un regalo, una experiencia gratuita o el kit para empezar.";
    var lista = ["Cuidado de la piel", "Maquillaje", "Fragancias", "Un regalo", "Experiencias", "Quiero emprender"];
    if (tema === "experiencias") {
      texto = "¿Preferís un momento para vos o con amigas? El facial es en la oficina. Con amigas puede ser en la oficina o en una casa.";
      lista = ["Un momento para mí", "Con mis amigas", "Quiero ser anfitriona"];
    } else if (tema === "fragancias") {
      texto = "Estás en fragancias. ¿Es para vos o para regalar?";
      lista = ["Para mí", "Para regalar"];
      estado.intencion = "fragancia";
      estado.espera = "para-aroma";
    } else if (tema === "producto" && estado.pieza) {
      var item = (window.OFERTAS || []).filter(function (p) { return p.id === estado.pieza; })[0];
      texto = item ? "Estás mirando " + item.nombre + ". Puedo dejarlo en el mensaje para Silvia o mostrarte otras piezas de " + (item.grupo || "este mes") + "." : texto;
      lista = ["Hablar con Silvia", "Ver otras"];
    } else if (tema === "sumate") {
      texto = "Para empezar, el kit sale $ 1.000, con productos por $ 5.490, catálogo y dos folletos. La capacitación es sin costo. No es una ganancia asegurada.";
      lista = ["Ver el video", "Hablar con Silvia"];
      estado.intencion = "sumate";
    }
    hilo.push({ de: "guia", texto: texto, chips: lista });
    pintarHilo();
    guardar();
  }

  async function detectar() {
    if ((!local() && !(metaApi && metaApi.content)) || !window.BQDMotor) { modo = "mock"; notaModo(); return; }
    try {
      var ctrl = new AbortController();
      var timer = setTimeout(function () { ctrl.abort(); }, 1200);
      var res = await fetch(API + "/salud", { signal: ctrl.signal });
      clearTimeout(timer);
      modo = res.ok ? "openai" : "mock";
    } catch (err) {
      modo = "mock";
    }
    notaModo();
  }

  async function consultar(texto) {
    if (modo === "openai") {
      var ctrl = new AbortController();
      var timer = setTimeout(function () { ctrl.abort(); }, 20000);
      try {
        var res = await fetch(API + "/v1/guia", {
          method: "POST",
          headers: { "Content-Type": "application/json", "X-Guia-Sesion": sesion() },
          signal: ctrl.signal,
          body: JSON.stringify({
            texto: texto,
            estado: estado,
            hilo: hilo.filter(function (m) { return m.de === "vos" || m.de === "guia"; }).slice(-8).map(function (m) {
              return { role: m.de === "vos" ? "user" : "assistant", content: m.texto };
            })
          })
        });
        clearTimeout(timer);
        if (!res.ok) throw new Error("respuesta");
        var dato = await res.json();
        if (!dato || typeof dato.mensaje !== "string") throw new Error("forma");
        return dato;
      } catch (err) {
        clearTimeout(timer);
        modo = "fallback";
        notaModo();
        burbuja("guia", "Sigo con la información del sitio, porque el servicio no respondió.");
      }
    }
    return window.BQDMotor.responder(texto, estado, window.OFERTAS || []);
  }

  async function enviar(texto) {
    texto = limpiar(texto);
    if (!texto || texto.length > 400) return;
    turno += 1;
    var mio = turno;
    hilo.push({ de: "vos", texto: texto });
    burbuja("vos", texto);
    input.value = "";
    var espera = document.createElement("p");
    espera.className = "asistente-espera";
    espera.textContent = "Estoy mirando lo publicado…";
    log.appendChild(espera);
    var dato = await consultar(texto);
    if (mio !== turno) { espera.remove(); return; }
    espera.remove();
    if (dato.estado) estado = Object.assign({}, estado, dato.estado);
    estado.productos = estado.productos || [];
    var ids = (dato.productos || []).filter(function (id) {
      return (window.OFERTAS || []).some(function (p) { return p.id === id; });
    }).slice(0, 3);
    hilo.push({ de: "guia", texto: dato.mensaje, chips: dato.chips || [], productos: ids });
    burbuja("guia", dato.mensaje);
    tarjetas(ids);
    chips(dato.chips || []);
    if (dato.accion === "whatsapp" || /hablar con silvia|revisar el mensaje|coordinar/i.test(texto)) vistaWhatsapp();
    guardar();
  }

  function abrir(tema) {
    previo = document.activeElement;
    abierto = true;
    panel.hidden = false;
    lanzador.setAttribute("aria-expanded", "true");
    document.body.classList.add("asistente-abierto");
    if (window.matchMedia("(max-width: 899px)").matches) panel.setAttribute("aria-modal", "true");
    if (!hilo.length) saludar(tema || "");
    else pintarHilo();
    input.focus();
  }
  function cerrar() {
    abierto = false;
    panel.hidden = true;
    lanzador.setAttribute("aria-expanded", "false");
    panel.setAttribute("aria-modal", "false");
    document.body.classList.remove("asistente-abierto");
    if (previo && previo.focus) previo.focus();
  }
  function reiniciar() {
    estado = {};
    hilo = [];
    turno += 1;
    try { sessionStorage.removeItem(CLAVE); } catch (err) {}
    log.innerHTML = "";
    saludar("");
  }

  lanzador.addEventListener("click", function () { abierto ? cerrar() : abrir(""); });
  raiz.querySelector('[data-acc="x"]').addEventListener("click", cerrar);
  raiz.querySelector('[data-acc="minus"]').addEventListener("click", cerrar);
  raiz.querySelector('[data-acc="restart"]').addEventListener("click", reiniciar);
  form.addEventListener("submit", function (ev) {
    ev.preventDefault();
    enviar(input.value);
  });
  document.addEventListener("keydown", function (ev) {
    if (ev.key === "Escape" && abierto) cerrar();
  });

  window.BQD = window.BQD || {};
  window.BQD.abrirGuia = function (opciones) {
    opciones = opciones || {};
    if (opciones.id) estado.pieza = opciones.id;
    if (!hilo.length) saludar(opciones.tema || "");
    abrir(opciones.tema || "");
  };

  var lanzar = document.getElementById("abrir-guia");
  if (lanzar) lanzar.addEventListener("click", function () { window.BQD.abrirGuia({ tema: "experiencias" }); });
  document.querySelectorAll("[data-guia]").forEach(function (el) {
    el.addEventListener("click", function (ev) {
      ev.preventDefault();
      window.BQD.abrirGuia({ tema: el.getAttribute("data-guia"), id: el.getAttribute("data-guia-id") || "" });
    });
  });
  var fichaGuia = document.getElementById("ficha-guia");
  if (fichaGuia) fichaGuia.addEventListener("click", function () {
    window.BQD.abrirGuia({ tema: "producto", id: window.BQD.piezaAbierta || "" });
  });

  leer();
  notaModo();
  detectar();
})();
