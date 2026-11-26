# Experiencia premium — 26 nov 2026

Demo local: `http://127.0.0.1:4173/`. No se publicó. Ritual no se tocó. Capturas en `qa-phase5/`.

## Qué se mejoró

Las experiencias vuelven a leerse como una invitación: foto, título, datos en una línea y después el texto. Se fueron las viñetas. Las dos fotos siguen alineadas y los dos botones también (968 px en 1440).

Anfitrionas usa el ancho que sobraba. El título es «Tu casa. Tus amigas. Tu momento.» Los dos beneficios quedan lado a lado en desktop. «Quiero ser anfitriona» abre WhatsApp. «Compartir esta experiencia» comparte el enlace de la sección. Ya no manda un mensaje a Silvia haciéndose pasar por un compartir.

«Ayudame a elegir» recorre tres pasos en la misma página, sin pedir datos y sin guardarlos. Si la persona elige un momento para ella, el facial queda en la oficina de Young: no se ofrece la casa. Con amigas se puede elegir oficina, casa o coordinar el lugar. El resultado arma el mensaje de WhatsApp.

Las categorías y Favoritos del mes dejaron las frases internas. La ficha dice «Consultar por WhatsApp» y el enlace compartido incluye el nombre de la pieza (`?pieza=` y también `?producto=`). Si el id no existe, la ficha no se abre y queda la selección vigente.

Los mensajes principales de facial, encuentro, anfitriona, producto y emprendimiento dicen qué quiere la persona.

## Qué queda apagado a propósito

`window.CAMPANA.activa` sigue en `habitual`. Navidad y el buscador de regalos existen en el código y solo aparecen si `navidad.lista` pasa a `true`. No hay precios estructurados, así que el buscador no pide presupuesto. Se probó forzando la bandera en memoria: no queda activo en el archivo.

## Qué no se rehízo

Skincare ya tenía las cuatro categorías, la vitrina y las fichas. No se reemplazó por otra galería. Se ajustó el texto de fragancias y el cierre de la ficha.

Novedades sigue siendo el Look de octubre, dicho como folleto vigente, no como una nota de este mes. No se inventaron notas.

El facial individual sigue siendo la naturaleza muerta de la rutina. La foto con amigas sigue siendo la oficina, en otro momento que el hero. Falta una foto de una sola persona en el facial.

## Recorridos probados

Inicio → facial y encuentro: los `href` de WhatsApp dicen la intención. No se envió ningún mensaje.

Inicio → anfitriona: botón de WhatsApp y botón de compartir distintos.

Inicio → asistente → individual → oficina → piel → mensaje con horario a coordinar. Con amigas aparecen oficina, casa y coordinar.

Inicio → categoría: los enlaces van a `#piel`, `#color`, `#perfume` y `#cuerpo`.

`tocador.html?pieza=velvet-scent` abre la ficha. `?producto=no-existe` no abre una ficha vacía.

Sumate conserva el video inline, sin loop, y el botón de la oportunidad está junto al precio, no al final del video.

Overflow horizontal: 0 en 1440 y en 390.

## Archivos

`index.html`, `tocador.html`, `novedades.html`, `estilos.css`, `sitio.js`, `ofertas.js`.

## Pendiente de aprobación

Una foto real del facial de a una. Materiales de Navidad, si Silvia quiere activar la campaña. Precios sueltos, si más adelante el buscador de regalos tiene que filtrar por presupuesto.
