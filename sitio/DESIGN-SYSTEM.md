# Design system de Cuentas Claras: "libreta viva"

Sale del boceto A (`../design/landing/a-libreta-viva.html`, elegido el 2026-10-26) y de la
identidad v2 (`../design/DESIGN.md`). Se ve vivo en `/sistema`.

**La idea:** todo pasa sobre una libreta de cuentas. El rosa y el maíz no son fondos: son el
plumón y el resaltador de quien la va llenando. El movimiento es ese gesto: palomea, subraya,
encierra, pega notas.

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

**Contraste (Lighthouse lo revisa):** crema sobre rosa da 4.3:1, no pasa AA en texto chico. Por
eso las pestañas y separadores rosas usan `--rosa-hondo`, y el botón rosa lleva 19px (texto
grande, basta 3:1).

**Tipografía:** Bricolage Grotesque variable (ejes `wdth` y `opsz`) para todo; Shrikhand
(`.rot`) para **un** remate por pieza. Escala: `--t-h1`, `--t-h2`, `--t-h3`, cuerpo 18px,
etiqueta 13px en mayúsculas.

**Movimiento:** curvas `--e-salida` (entra y frena), `--e-rebote` (se pega con brinquito),
`--e-trazo` (el plumón).

## Componentes (`src/styles/componentes.css`)

`.btn` (primario cacao con sombra rosa, `.claro`, `.rosa` para paneles, `.ancho`),
`.enlace-flecha`, `.separador` (`.rosa`, `.cacao`), `.resaltado`, `.ficha` + `.pestana`,
`.palomeo`, `.nota` (`.papel`, `.rosa`), `.chip`, `.globo`, `.renglones` / `.renglon` /
`.casilla`, `.hoja`, `.panel` + `.campos` / `.campo` / `.opciones` / `.opcion` /
`.casilla-acepto` / `.error` / `.fino`, `.marco`, `.pregunta` (details), `.billete`.

Componentes Astro: `Barra`, `Pie`, `Simbolos` (el billete palomeado y el de YouTube),
`JsonLd`.

## Movimiento

| Atributo | Qué hace |
|---|---|
| `data-entra` (+ `--i`, `--entra-giro`) | Sube y se endereza al entrar a la pantalla, escalonado |
| `data-resalta` | El resaltador de maíz se pasa sobre la frase |
| `data-palomea` | Se dibuja la palomita |
| `data-magnetico` | El botón se va un poco hacia el mouse (solo con mouse) |
| `lluviaDeBilletes(el)` | 18 billetes en arco. **Solo al suscribirse**, nunca siguiendo al cursor |

La hoja que se endereza y la foto que flota usan animaciones ligadas al scroll
(`animation-timeline: view()`), sin JavaScript; donde no hay soporte, se quedan quietas.

Reglas: todo empieza visible (solo con `html.js` y sin "reducir movimiento" se esconde lo que va
a entrar); con "reducir movimiento" no se mueve nada; nada se anima que no sea transform,
opacity o un trazo de SVG.

## Reglas que no se rompen

- Fondo de página siempre crema con cuadrícula. Rosa y maíz nunca de fondo de página.
- Un solo remate en Shrikhand por bloque.
- Nada de colores, tipos o lockups de sicastro.com, soycontador.ai o TodoConta.
- Copy: tuteo, sin raya larga, comillas curvas en lo que se ve, sin año, sin precios.
