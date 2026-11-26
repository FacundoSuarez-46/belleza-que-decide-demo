# Design refinement — 26 nov 2026

Demo local: `http://127.0.0.1:4173/`. No se publicó. Ritual no se tocó.

Capturas: `qa-phase4/antes/` y `qa-phase4/despues/`.

## Qué estaba roto

El facial individual repetía el encuadre grupal del hero. Las dos fotos de experiencias no compartían proporción ni el borde inferior. «Belleza entre amigas» iba sobre un bloque salmón, con el texto al borde y el botón desalineado. El título de la sección no compartía la grilla.

El bloque de anfitrionas era una franja de 11 rem: la foto pegada al título, el titular a todo el ancho y los beneficios escritos como una nota interna.

El asesoramiento de categorías quedaba en un párrafo suelto. Favoritos del mes se presentaba como una instrucción («cuatro piezas para mirar»). Los regalos se trataban como un producto más. Las preguntas de envío y pago estaban duplicadas en Inicio y en Skincare. El pie decía «no envía avisos automáticos». El fondo salmón saturado cubría varias bandas.

## Qué se corrigió

Experiencias en dos columnas con la misma proporción (4/3), la misma altura de foto y los botones en la misma línea. Medido en 1440 y en 1024: las dos tarjetas miden igual y los dos botones arrancan en el mismo píxel.

El facial individual usa `piel-mesa.jpg`, una naturaleza muerta de la rutina. No hay en el proyecto una foto de una sola persona en el facial. Reusar el hero hubiera sido mentira. La experiencia con amigas usa `sumate-mesa.jpg`: las mismas mujeres de la oficina, en otro momento, probando producto. No es el póster del hero.

Anfitrionas es un bloque horizontal: foto cerca del 30 %, aire de 32 px, título en un ancho corto, superficie rosa empolvado. En el teléfono se apila con padding. «Recomendala por WhatsApp» sigue siendo un mensaje a Silvia, no un compartir del sitio.

Categorías dentro del mismo contenedor, con la invitación «¿Necesitás ayuda para elegir?» en esa misma medida. Toda la tarjeta sigue siendo el enlace.

Favoritos: texto comercial, afiches enteros (`object-fit: contain`), «Ver detalles» alineado. Los regalos abren «Ver la campaña» y en la ficha figuran como campaña. No se les inventó ficha de producto. Un sello sobre el afiche tapaba la foto y se sacó.

Las preguntas de envíos y pagos quedan solo en Skincare (`tocador.html#compras`). Inicio enlaza ahí. La respuesta de gratuidad dice que se prueba, se recomienda y se compra solo si gusta.

Sumate mantiene video y oferta en dos columnas. Los beneficios pasaron a cuatro ideas con título y una línea. $ 1.000 y $ 5.490 siguen siendo inversión y valor en productos, no una ganancia.

El hero conserva el video, el velo local y los dos botones. El titular es un poco más presente. La pausa es un control translúcido de 44 px, no un disco blanco.

El pie invita a agregar el sitio a la pantalla de inicio, sin prometer avisos.

## Qué se preservó

Logotipo, Fraunces y Manrope, header sticky, WhatsApp `+598 99 365 404`, PWA, afiches con el precio impreso, Look de octubre, condiciones del facial, del encuentro y del kit. La ficha sigue abriéndose con `?pieza=` y el video de Sumate sigue inline, mudo, sin loop, y se pausa si la persona lo pausa o si sale de pantalla.

## Pruebas

Chrome en 360, 390, 430, 768, 1024, 1280, 1440 y 1920. Overflow horizontal: 0 en todos. Ancla `#compras` queda debajo del header. Sin build: el sitio es estático.

## Pendiente de foto

Hace falta una fotografía real de una persona en el facial individual: cuidado, aplicación o asesoramiento de a una. Hasta que exista, la portada de esa experiencia es la rutina de productos, con un texto alternativo que no dice que hay una clienta.
