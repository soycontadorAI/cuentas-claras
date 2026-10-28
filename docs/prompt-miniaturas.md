# Prompt para las miniaturas de Cuentas Claras

Se pega tal cual en Claude (Claude Code, Claude Design o el chat) junto con la duda del video, el
título y la foto de Israel. Sale de `design/DESIGN.md` (identidad v2), `sitio/DESIGN-SYSTEM.md`
("libreta viva", la identidad del sitio desde el 2026-10-26) y los stickers de
`design/assets/stickers/`. Si una regla cambia allá, se cambia aquí.

El texto **nunca** lo dibuja un modelo de imagen (en español lo corrompe). La miniatura se arma en
HTML/CSS a 1280 × 720 y se exporta con Chrome; el modelo de imagen solo entra si hace falta una
escena, y sin letras (al final hay un prompt aparte para eso).

---

```text
Diseña la miniatura de YouTube (1280 × 720, HTML + CSS, exportable con Chrome sin interfaz) de un
video del canal Cuentas Claras (youtube.com/@cuentasclaras_mx): el canal del despacho S & I Castro
Consultores, conducido por Israel Castro, contador público. Explica el SAT y el dinero de las
personas físicas en México como una consulta: una duda, un video.

## A quién le habla
Persona física de 25 a 44 años, asalariada de $33,000 al mes o más, que llega por búsqueda (96% es
nuevo). Compra certeza. La miniatura tiene que verse cercana y clara, nunca de alarma ni oficial.

## Los datos de este video
- La duda, como la diría un cliente: {{DUDA}}
- Título de la miniatura (4 palabras o menos): {{TITULO}}
- La palabra del remate (una sola, va rotulada): {{REMATE}}
- Plantilla: {{Trámite | Error | Dinero}}
- Renglones o pasos, si la plantilla los lleva (máximo 3): {{RENGLONES}}
- Foto de Israel (recorte con fondo transparente): {{ARCHIVO}}
- Sticker opcional (uno, de design/assets/stickers/png): {{STICKER o ninguno}}

## La identidad: "libreta viva"
Todo pasa sobre una libreta de cuentas. El rosa y el maíz no son fondos: son el plumón y el
resaltador de quien la va llenando.
- Fondo: SIEMPRE la libreta. Crema #FFF6E8 con cuadrícula de 32 px en cacao al 12%
  (rgba(59,36,24,.12)) y la línea de margen vertical rosa claro #F2A3C7 de 2 px a unos 130 px de la
  orilla izquierda. Nada de degradados, fotos de fondo, texturas ni viñetas.
- Paleta (y nada más):
  - cacao #3B2418: el texto y los trazos.
  - rosa #E4007C: el plumón (el remate, la raya del total, el paso actual, una palomita).
  - maíz #F6C343: el resaltador, en dosis chicas (detrás de una palabra, una estampa).
  - papel #FFFBF3: hojas o tarjetas encima de la libreta.
  - rosa hondo #B0005F: solo para texto chico sobre rosa.
  Rosa y maíz NUNCA de fondo de la miniatura ni en bloques grandes. Nunca rosa sobre maíz ni maíz
  sobre rosa con texto (2.8:1).
- Tipografía:
  - Título en Bricolage Grotesque 800, ancho (wdth) 92, cacao, interlínea 0.92, lo más grande que
    quepa (entre 110 y 170 px).
  - UNA palabra o frase corta de remate en Shrikhand, rosa, con un giro de -3° a -5°. Nunca el título
    completo en Shrikhand, nunca dos remates.
  - Las dos están en Google Fonts; en local, en design/guia/fuentes/ (Bricolage latin y latin-ext,
    Shrikhand).
- Gestos de plumón (máximo uno por miniatura): el subrayado a mano rosa bajo el remate, el
  resaltado maíz detrás de una palabra, una palomita rosa, o un círculo a mano alrededor de una
  cifra. Trazo irregular, como dibujado; no una línea recta de CSS.
- Sombras: duras y planas, en cacao (8 a 12 px de desplazamiento, sin desenfoque) para tarjetas,
  hojas y stickers. La foto de Israel lleva sombra suave (la de .recorte en design/componentes.css).
- Stickers (opcional, uno): son calcomanías dibujadas con trazo cacao, borde blanco de recorte y
  sombra dura. Van girados entre -10° y 10°, nunca encima del título ni de la cara.
- El símbolo de la marca es el billete palomeado (design/simbolo.svg). En la miniatura no hace
  falta; si entra, chico y en la esquina superior izquierda.

## Las tres plantillas (las distingue lo que llevan encima, no el fondo)
1. Trámite (CSF, e.firma, RFC, buzón): título cacao, hasta 3 pasos en renglones con su casilla y el
   actual en rosa, y el año (si aplica) en estampa maíz.
2. Error (rechazos y mensajes del portal): título cacao, la captura real del portal tal cual (sin
   retocar ni recolorear) en una hoja con sombra dura, y "así se arregla" rotulado con la raya.
3. Dinero (aguinaldo, saldo a favor, deducciones, intereses): título cacao, hasta 3 renglones con
   puntos guía y la cifra a la derecha, y el total rotulado en rosa con su raya.

## Composición
- Israel en el tercio derecho, en primer plano: hombros arriba, la cabeza toca o rebasa la orilla
  de arriba. Detrás de él: NADA (ni círculo, ni placa, ni brillo), solo su sombra sobre la libreta.
  El recorte nunca deja un brazo o una manga cortados en vertical.
- El título a la izquierda, en dos o tres renglones cortos, alineado a la izquierda y pegado al
  margen rosa.
- La esquina inferior derecha (unos 220 × 90 px) va LIBRE: ahí YouTube pone la duración o el "EN
  VIVO".
- El elemento de apoyo (hoja, captura, renglones) puede salirse por la orilla: es ambientación,
  basta con que se lea un renglón. Nunca se achica el título para que quepa la lista; si no cabe,
  se acorta el texto.

## Lo que NO va
- Nada que parezca oficial: ni guinda, ni dorado, ni logos o escudos del SAT, del IMSS o del
  gobierno, ni tipografías institucionales.
- Nada de las otras marcas: ni el azul de TodoConta, ni el navy de soycontador.ai, ni lo de
  sicastro.com.
- Sin precios, sin el año en el título (los videos duran; la cifra con su año puede ir en un
  renglón), sin flechas rojas de YouTube genérico, sin emojis, sin caras de susto, sin "URGENTE".
- Sin raya larga (—) y nunca comillas « »; si lleva comillas, curvas “ ”.

## Cómo se revisa
1. Renderiza a 1280 × 720 y también a 168 px de ancho (la lista en el teléfono) y a 210 px (el
   feed). Si a 168 px no se lee el título, no sale: acorta el título o súbelo de tamaño.
2. Cuenta: un solo remate en Shrikhand, un solo gesto de plumón, máximo un sticker, rosa y maíz
   solo de acento.
3. Revisa que la esquina inferior derecha esté libre y que nada tape la cara.
4. Entrega el HTML y el PNG, y una variante B que cambie solo una cosa (el título o la foto), para
   el A/B nativo de YouTube.
```

---

## Si hace falta una escena (modelo de imagen)

Casi nunca: la libreta ya es el fondo. Solo cuando la miniatura pide un objeto real (una hoja
impresa, un teléfono con la app del SAT). Se genera **sin letras** y se recorta; el texto va encima
en HTML. El prompt va en inglés porque el modelo lo traduce de todos modos.

```text
A single {{OBJECT}} photographed from above on a plain warm cream surface (#FFF6E8), soft single
key light from the top left, gentle natural shadow, flat lay, high detail, no people. The paper or
screen is completely blank. Absolutely no text, no letters, no numbers, no logos, no watermarks,
no signage. Warm palette: cream, cocoa brown (#3B2418), small touches of magenta (#E4007C) and
corn yellow (#F6C343). No government seals, no green-white-red, no gold, no burgundy.
```

Si sale con letras, se descarta: no se parcha.

## Ejemplo: el primer live

- Duda: "Si solo tengo sueldo, ¿tengo que declarar?"
- Título: "¿Tengo que declarar?" con "declarar?" como remate.
- Plantilla Dinero, con dos renglones: "Más de $400,000 al año" y "Dos patrones a la vez", con una
  palomita rosa en uno.
- Foto: `design/assets/israel-duda.webp`. Sticker: `recibo` (nómina), abajo a la izquierda de la
  foto, sin tocar la esquina de la duración.
