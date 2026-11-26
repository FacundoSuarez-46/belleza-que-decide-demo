# Guía de belleza — 26 nov 2026

La guía está en el sitio. En esta máquina el servidor local responde con OpenAI. GitHub Pages sigue estático y, fuera de localhost, usa la guía del sitio. No se publicó. Ritual no se tocó. La credencial no está en el JavaScript público ni en el repositorio.

## Cómo está armado

La pantalla (`asistente.js`) no elige el modelo ni las instrucciones. Pide una respuesta y dibuja solo ids que existen en `ofertas.js`.

Hay dos proveedores:

- OpenAI, en `servidor/server.js`, con la Responses API, `store: false` y salida en JSON. El modelo sale de `OPENAI_MODEL` (hoy `gpt-4.1-mini`).
- El motor del sitio, `motor.js`, cuando no hay servidor o el servidor falla. En ese caso la guía lo dice. No finge que el modelo sigue activo.

El catálogo se lee del mismo `ofertas.js` que Inicio y Skincare. El servidor lo vuelve a leer si el archivo cambia. Un id que el modelo invente se descarta.

## Qué se probó de verdad

Salud del servidor: responde y tiene modelo.

Una consulta de perfume floral para mamá. El modelo no le asignó familia a ningún frasco. Mostró tres ids reales de Fragancias y dijo que el perfil de aroma no está publicado.

En el navegador, en `http://127.0.0.1:4173/`, la guía se identificó como asistente con IA. «Quiero un labial» devolvió tres piezas de labios que están en el catálogo, con miniatura, Ver detalles y Consultar. Al minimizar y volver a abrir, los tres mensajes seguían. En 390 px el panel ocupa la pantalla y el campo de escritura queda abajo. Overflow horizontal: 0.

El motor del sitio, sin red, cubrió perfume, presupuesto de $ 1.500 sin afirmar que una pieza entre, encuentro con amigas, el kit de $ 1.000, una pregunta fuera de tema y envíos con tarjeta.

## Iconos y textos

Metadatos de las dos experiencias, los dos beneficios de anfitriona, los cuatro de Sumate, el pin de Young y Instagram usan trazos de Lucide, solo los que hacen falta. El bloque de inicio de la guía ahora dice «La belleza empieza con vos» y abre la misma guía. El video ya no dice que Silvia lo narra.

## Límites

No hay streaming: la respuesta llega entera para poder validar los ids antes de mostrarlos. No hay precios sueltos, así que un presupuesto se anota para Silvia y no filtra piezas. Navidad sigue apagada. Falta la foto de una sola persona en el facial.

Para dejar el modelo en un dominio público hace falta un servidor con `OPENAI_API_KEY`, el mismo `server.js`, y la meta `bqd-guia-api` apuntando a ese origen. CORS ya incluye el Pages y bellezaquedecide.com. Límites de hoy: 8 pedidos por minuto por IP y 80 por día por sesión. El archivo `servidor/.env` está fuera de Git.

Para correrlo acá: `npm start` dentro de `servidor/`.
