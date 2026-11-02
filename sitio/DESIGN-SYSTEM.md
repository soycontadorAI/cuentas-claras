# Design system de Cuentas Claras: "libreta viva"

Sale de la identidad v2 (`../design/DESIGN.md`) y, desde el 2026-11-02, de la variante
**"libro mayor vivo"** (`../design/landing/v2/4-libro-mayor-vivo.html`), que reemplazó a la
"libreta viva" del boceto A (2026-10-26). Se ve vivo en `/sistema`.

**La idea:** todo pasa sobre una libreta de cuentas. La estructura es de libro mayor: celdas de
filete fino de 1px, cifras tabulares, renglones con puntos guía, todo quieto y legible. El juego
vive en los bordes: pestañas de folder, notas, un sello, calcomanías, el plumón que encierra, y
movimiento ligado al scroll. El rosa y el maíz no son fondos: son el plumón y el resaltador de
quien la va llenando.

**Cómo se arma una página:** barra con ligas en celdas → una celda grande por idea (`.cel` con su
`.pestana`) → bento de 12 columnas con 54px entre filas (ahí sale la pestaña) → pie en celdas.
Las páginas internas (`/agendar`, `/listo`, `/404`, `/privacidad`) son una o dos celdas con su
pestaña y, si cabe, una calcomanía. Un solo CTA por bloque: la guía manda en la portada y la
calculadora vive en su propia celda debajo.

## Tokens (`src/styles/tokens.css`)

| Token | Valor | Uso |
|---|---|---|
| `--crema` | #FFF6E8 | La libreta. Fondo de todo, siempre |
| `--papel` | #FFFBF3 | Hojas y tarjetas encima |
| `--cacao` | #3B2418 | Texto, trazo, paneles de formulario |
| `--cacao-70` | 72% | Texto secundario (5.6:1 sobre crema) |
| `--rosa` | #E4007C | Plumón: palomitas, subrayados, números grandes |
| `--rosa-hondo` | #B0005F | Rosa con texto encima o texto rosa chico |
| `--maiz` | #F6C343 | Resaltador, pestañas, foco dentro de paneles |
| `--margen` | #F2A3C7 | Solo la línea de margen (no en el teléfono) |
| `--linea` | 1px solid cacao | El filete de toda celda |
| `--hueco` | 14px | Entre celdas del bento |

**Contraste (Lighthouse lo revisa):** crema sobre rosa da 4.3:1, no pasa AA en texto chico. Por
eso las pestañas rosas usan `--rosa-hondo`, y el botón rosa lleva 19px (texto
grande, basta 3:1).

**Tipografía:** Bricolage Grotesque variable (ejes `wdth` y `opsz`) para todo; Shrikhand
(`.rot`) para **un** remate por pieza. Escala: `--t-h1`, `--t-h2`, `--t-h3`, cuerpo 18px,
etiqueta 13px en mayúsculas.

**Movimiento:** curvas `--e-salida` (entra y frena), `--e-rebote` (se pega con brinquito),
`--e-trazo` (el plumón).

## Componentes (`src/styles/componentes.css`)

`.btn` (primario cacao con sombra rosa, `.claro`, `.rosa` para celdas oscuras, `.ancho`),
`.enlace-flecha`, `.cel` (`.oscura`) + `.pestana` (`.rosa`, `.cacao`), `.sticker`, `.resaltado`,
`.palomeo`, `.nota` (`.papel`, `.rosa`), `.chip`, `.globo`, `.videos` / `.video`, `.hoja`
(papel con cinta de maíz), formulario (`.campos` / `.campo` / `.opciones` / `.opcion` /
`.casilla-acepto` / `.error` / `.fino`), `.pregunta` (details a filete fino), `.billete`.

- **Pestaña:** sobresale del borde de arriba de la celda. Con el mouse sube 8px **con su texto** y
  una extensión del mismo color (`::after`) rellena el hueco hasta la celda: sale del expediente,
  nunca flota. Maíz para lo general, rosa hondo para "tu declaración" y "sin rodeos", cacao para
  lo que cierra.
- **Celda oscura** (`.cel.oscura`): solo para lo que pesa, la duda de la serie y los formularios.
- **Calcomanía:** PNG de `design/assets/stickers/` (copiados a `src/assets/stickers/`), una o dos
  por celda, en la esquina de arriba, giradas entre -10° y 10°, nunca sobre texto ni cifras.
- Se quitaron `.separador`, `.ficha`, `.panel`, `.marco`, `.renglones` y el rayado de los fondos.

Componentes Astro: `Barra` (ligas en celdas y una raya rosa que avanza con la lectura), `Pie`,
`Simbolos` (el billete palomeado y el de YouTube), `JsonLd`.

## Movimiento

| Atributo | Qué hace |
|---|---|
| `data-entra` (+ `--i`) | Sube 18px y frena al entrar a la pantalla, escalonado. Sin giro ni rebote |
| `data-pega` | La calcomanía llega grande y girada y se pega con rebote |
| `data-resalta` | El resaltador de maíz se pasa sobre la frase |
| `data-palomea` | Se dibuja la palomita |
| `data-magnetico` | El botón se va un poco hacia el mouse (solo con mouse) |
| `lluviaDeBilletes(el)` | 18 billetes en arco. **Solo al suscribirse**, nunca siguiendo al cursor |

Las celdas que se asientan (`.vivo`), la hoja que se endereza, las calcomanías que derivan, el
sello que gira y la raya de lectura de la barra usan animaciones ligadas al scroll
(`animation-timeline: view()` / `scroll(root)`), sin JavaScript; donde no hay soporte, se quedan
quietas. La marquesina de preguntas es CSS puro. El total de la calculadora cuenta hasta la cifra
y "brinca".

Reglas: todo empieza visible (solo con `html.js` y sin "reducir movimiento" se esconde lo que va
a entrar); con "reducir movimiento" no se mueve nada; nada se anima que no sea transform,
opacity o un trazo de SVG.

## Reglas que no se rompen

- Fondo de página siempre crema con cuadrícula. Rosa y maíz nunca de fondo de página (la pestaña y la cinta son marcas, no fondos).
- Un solo remate en Shrikhand por bloque.
- Nada de colores, tipos o lockups de sicastro.com, soycontador.ai o TodoConta.
- Copy: tuteo, sin raya larga, comillas curvas en lo que se ve, sin año, sin precios.
