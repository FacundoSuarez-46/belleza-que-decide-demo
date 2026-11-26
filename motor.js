/* Motor de la guía. Solo usa el catálogo y los hechos confirmados. */
(function (root) {
  function normalizar(texto) {
    return String(texto || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function tiene(texto, palabras) {
    return palabras.some(function (p) { return texto.indexOf(p) !== -1; });
  }

  function presupuesto(texto) {
    var m = String(texto || "").replace(/\./g, "").match(/\$?\s*(\d{3,6})/);
    if (!m) return "";
    var n = Number(m[1]);
    if (n < 100 || n > 500000) return "";
    return "$ " + n.toLocaleString("es-UY");
  }

  function base(estado) {
    var e = JSON.parse(JSON.stringify(estado || {}));
    e.productos = e.productos || [];
    return e;
  }

  function deGrupo(catalogo, grupo, n) {
    return (catalogo || []).filter(function (item) {
      return item.grupo === grupo && !item.campana;
    }).slice(0, n || 3).map(function (item) { return item.id; });
  }

  function responder(texto, estado, catalogo) {
    var e = base(estado);
    var t = normalizar(texto);
    var dinero = presupuesto(texto);
    if (dinero) e.presupuesto = dinero;
    var fuerte = tiene(t, ["silvia", "whatsapp", "persona", "asesora", "hablar con"]);
    if (fuerte) {
      e.espera = "";
      return salida("Puedo armarte un mensaje para Silvia con lo que fuimos viendo. Lo revisás antes de enviarlo.", ["Revisar el mensaje", "Seguir acá"], [], "whatsapp", e);
    }
    if (e.espera && !tiene(t, ["emprender", "kit", "envio", "envian", "tarjeta"])) {
      return espera(t, e, catalogo);
    }
    if (tiene(t, ["emprender", "emprend", "sumarme", "sumate", "kit", "vender", "comision", "cuanto sale empezar", "cuanto cuesta empezar", "1000", "5490"])) {
      e.intencion = "sumate";
      e.espera = "";
      return salida("Para empezar, el kit sale $ 1.000. Incluye productos por $ 5.490, el catálogo y dos folletos. La capacitación es sin costo y no hace falta experiencia. Tampoco hay un pedido obligatorio todos los meses. Eso no es una ganancia asegurada.", ["Ver Sumate", "Hablar con Silvia"], [], "sumate", e);
    }
    if (tiene(t, ["envio", "envian", "envios", "tarjeta", "transferencia", "deposito", "pagar", "pago", "se rompe", "cambio"])) {
      e.intencion = "compras";
      e.espera = "";
      return salida("Podés retirar en la oficina, coordinar que te lo lleven o pedir envío a todo el país. Desde 2.000 pesos, el envío no se cobra. Se puede pagar con tarjeta, transferencia o depósito. Si el frasco se rompe o el producto no sale, la empresa lo cambia.", ["Hablar con Silvia", "Ver productos"], [], "ninguna", e);
    }
    if (tiene(t, ["anfitriona", "en mi casa", "en casa"])) {
      e.intencion = "casa";
      e.lugar = "casa";
      e.espera = "";
      return salida("La experiencia en casa es con amigas. Quien invita recibe un regalo de bienvenida y hay un beneficio según lo que se vende. El porcentaje no está publicado: se coordina con Silvia. No hay obligación de comprar.", ["Quiero ser anfitriona", "Ver experiencias"], [], "experiencia", e);
    }
    if (tiene(t, ["amigas", "grupo", "juntas", "organizar algo"])) {
      e.intencion = "grupal";
      e.espera = "lugar";
      return salida("El encuentro con amigas es para 2 a 6 personas, de una hora a una hora y media. Es gratuito y nadie está obligada a comprar. ¿Lo pensás en la oficina o en una casa?", ["En la oficina", "En una casa", "Lo coordinamos"], [], "experiencia", e);
    }
    if (tiene(t, ["facial", "de a una", "para mi sola", "solo para mi", "turno", "reservar"])) {
      e.intencion = "individual";
      e.lugar = "oficina";
      e.espera = "";
      return salida("El facial es individual, en la oficina de Young, dura 45 minutos y es gratuito. Podés pedir higiene, oxigenación, rehidratación o la línea coreana. El horario se coordina por WhatsApp.", ["Coordinar el facial", "Ver cuidado de la piel"], [], "experiencia", e);
    }
    if (tiene(t, ["perfume", "fragancia", "olor", "aroma"])) {
      e.intencion = "fragancia";
      e.categoria = "Fragancias";
      if (!e.para) {
        e.espera = "para-aroma";
        return salida("¿La fragancia es para vos o para regalar?", ["Para mí", "Para regalar"], [], "ninguna", e);
      }
      e.espera = "aroma";
      return salida("¿Qué tipo de aroma te imaginas? En el catálogo no está confirmada la familia de cada frasco, así que después te muestro opciones para mirar.", ["Florales", "Dulces", "Frescos", "Intensos", "No estoy segura"], [], "ninguna", e);
    }
    if (tiene(t, ["labial", "maquillaje", "labio", "tono", "lapiz"])) {
      e.intencion = "maquillaje";
      e.categoria = "Labios";
      e.espera = "uso";
      return salida("¿Lo buscás para todos los días o para una ocasión?", ["Uso diario", "Una ocasión", "Ver los tonos"], [], "ninguna", e);
    }
    if (tiene(t, ["piel", "crema", "rutina", "cara", "skincare", "cutis"])) {
      e.intencion = "piel";
      e.categoria = "Piel";
      e.espera = "piel";
      return salida("Puedo mostrarte el cuidado que está este mes, o coordinar el facial gratuito para probarlo en la oficina. No reemplaza una consulta médica.", ["Ver productos", "Quiero el facial"], [], "ninguna", e);
    }
    if (tiene(t, ["regalo", "regalar", "mama", "madre", "cumple", "amiga"])) {
      e.intencion = "regalo";
      if (tiene(t, ["mama", "madre"])) e.para = "mamá";
      else if (tiene(t, ["amiga"])) e.para = "una amiga";
      if (dinero) e.presupuesto = dinero;
      if (!e.para) {
        e.espera = "regalo-para";
        return salida("Qué lindo. ¿Para quién es el regalo?", ["Para mamá", "Para una amiga", "Para mí", "Todavía no sé"], [], "ninguna", e);
      }
      e.espera = "regalo-tipo";
      return salida("¿Por dónde te gustaría mirar? Si me decís un presupuesto, lo anoto para Silvia. No puedo confirmar si una pieza entra en ese monto.", ["Fragancias", "Maquillaje", "Cuidado de la piel", "Ver la campaña"], [], "ninguna", e);
    }
    return salida("No tengo información suficiente para orientarte sobre eso. Puedo ayudarte con productos de este mes, una experiencia gratuita o el kit para empezar. También podés seguir con Silvia.", ["Ver productos", "Experiencias", "Hablar con Silvia"], [], "ninguna", e);
  }

  function espera(t, e, catalogo) {
    if (e.espera === "para-aroma") {
      e.para = tiene(t, ["regal"]) ? "regalo" : "mí";
      e.espera = "aroma";
      return salida("¿Qué tipo de aroma te imaginas? No tengo confirmada la familia de cada frasco.", ["Florales", "Dulces", "Frescos", "Intensos", "No estoy segura"], [], "ninguna", e);
    }
    if (e.espera === "aroma") {
      e.aroma = tiene(t, ["floral"]) ? "florales" : tiene(t, ["dulce"]) ? "dulces" : tiene(t, ["fresc"]) ? "frescos" : tiene(t, ["intens"]) ? "intensos" : "sin definir";
      e.espera = "";
      e.productos = deGrupo(catalogo, "Fragancias", 3);
      return salida("Estas fragancias están en la selección de este mes. No afirmo que coincidan con un aroma " + e.aroma + ", porque eso no está cargado. Silvia puede ayudarte a elegir.", ["Hablar con Silvia", "Ver otra cosa"], e.productos, "ninguna", e);
    }
    if (e.espera === "uso") {
      e.uso = tiene(t, ["diario", "dias", "todos"]) ? "diario" : tiene(t, ["ocasion", "evento", "especial"]) ? "ocasión" : "ver tonos";
      e.espera = "";
      e.productos = deGrupo(catalogo, "Labios", 3);
      return salida("Estos son labios de este mes, para mirar. No tengo confirmado cuál es de uso diario y cuál es de ocasión.", ["Hablar con Silvia"], e.productos, "ninguna", e);
    }
    if (e.espera === "piel") {
      if (tiene(t, ["facial", "experiencia", "probar", "oficina"])) {
        e.intencion = "individual";
        e.lugar = "oficina";
        e.espera = "";
        return salida("El facial es en la oficina, de a una, 45 minutos y gratuito. El horario se coordina.", ["Coordinar el facial"], [], "experiencia", e);
      }
      e.espera = "";
      e.productos = deGrupo(catalogo, "Piel", 3);
      return salida("Esto es el cuidado de la piel que está publicado este mes. La recomendación fina se hace en el facial.", ["Quiero el facial", "Hablar con Silvia"], e.productos, "ninguna", e);
    }
    if (e.espera === "lugar") {
      e.lugar = tiene(t, ["casa"]) ? "casa" : tiene(t, ["coordin"]) ? "a coordinar" : "oficina";
      e.espera = "";
      var donde = e.lugar === "casa" ? "en una casa" : e.lugar === "a coordinar" ? "en el lugar que puedan coordinar" : "en la oficina";
      return salida("Quedó un encuentro con amigas, " + donde + ". Es gratuito y sin obligación de compra.", ["Coordinar por WhatsApp", "Ver experiencias"], [], "experiencia", e);
    }
    if (e.espera === "regalo-para") {
      e.para = tiene(t, ["mama", "madre"]) ? "mamá" : tiene(t, ["amiga"]) ? "una amiga" : tiene(t, ["mi"]) ? "mí" : "sin definir";
      e.espera = "regalo-tipo";
      return salida("¿Por dónde miramos? Si hay un presupuesto, lo dejo anotado para Silvia. No confirmo precios desde acá.", ["Fragancias", "Maquillaje", "Cuidado de la piel"], [], "ninguna", e);
    }
    if (e.espera === "regalo-tipo") {
      var grupo = tiene(t, ["fragan", "perfume"]) ? "Fragancias" : tiene(t, ["maq", "labial"]) ? "Labios" : tiene(t, ["piel", "cuidado"]) ? "Piel" : "";
      e.categoria = grupo || "Campaña";
      e.espera = "";
      e.productos = grupo ? deGrupo(catalogo, grupo, 3) : [];
      var extra = e.presupuesto ? " Anoté un presupuesto de " + e.presupuesto + " para el mensaje, sin afirmar que una pieza entre en ese monto." : "";
      if (!e.productos.length) {
        return salida("De manos y cuerpo no hay una pieza cargada este mes. Puedo dejarte el mensaje para que Silvia te oriente." + extra, ["Hablar con Silvia"], [], "whatsapp", e);
      }
      return salida("Estas son opciones de " + grupo.toLowerCase() + " para explorar, no una recomendación cerrada." + extra, ["Hablar con Silvia"], e.productos, "ninguna", e);
    }
    e.espera = "";
    return responder(t, e, catalogo);
  }

  function salida(mensaje, chips, productos, accion, estado) {
    estado.accion = accion;
    return { mensaje: mensaje, chips: chips, productos: productos, accion: accion, estado: estado };
  }

  function resumen(estado) {
    var e = estado || {};
    var lineas = ["¡Hola, Silvia! Estuve con la guía virtual de Belleza que Decide."];
    if (e.intencion === "sumate") {
      lineas.push("Me interesa el kit para empezar, la capacitación y cómo se comercializa. No busco una ganancia prometida, quiero entender cómo es.");
    } else if (e.intencion === "individual") {
      lineas.push("Me gustaría coordinar el facial gratuito, individual, en la oficina.");
    } else if (e.intencion === "grupal" || e.intencion === "casa") {
      lineas.push("Me gustaría coordinar una experiencia con amigas" + (e.lugar ? ", " + (e.lugar === "casa" ? "en una casa" : e.lugar === "oficina" ? "en la oficina" : "en un lugar a coordinar") : "") + ".");
    } else if (e.intencion === "fragancia") {
      lineas.push("Estoy mirando fragancias" + (e.para === "regalo" ? " para regalar" : e.para === "mí" ? " para mí" : "") + (e.aroma && e.aroma !== "sin definir" ? ". Me imagino aromas " + e.aroma : "") + ".");
    } else if (e.intencion === "maquillaje") {
      lineas.push("Estoy mirando labios" + (e.uso ? " para " + e.uso : "") + ".");
    } else if (e.intencion === "piel") {
      lineas.push("Quiero orientación de cuidado de la piel.");
    } else if (e.intencion === "regalo") {
      lineas.push("Estoy buscando un regalo" + (e.para && e.para !== "sin definir" ? " para " + e.para : "") + (e.categoria ? ", mirando " + e.categoria.toLowerCase() : "") + ".");
    } else if (e.intencion === "compras") {
      lineas.push("Tengo una consulta sobre envíos, pagos o un cambio.");
    } else {
      lineas.push("Me gustaría seguir la consulta con vos.");
    }
    if (e.presupuesto) lineas.push("Mencioné un presupuesto aproximado de " + e.presupuesto + ". No está confirmado contra una pieza.");
    if (e.productos && e.productos.length) lineas.push("Miramos: " + e.productos.join(", ") + ".");
    if (e.pieza) lineas.push("Entré desde la ficha " + e.pieza + ".");
    lineas.push("¿Podemos seguir por acá?");
    return lineas.join(" ");
  }

  var api = { responder: responder, resumen: resumen, normalizar: normalizar };
  root.BQDMotor = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
