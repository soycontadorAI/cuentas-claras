# Cuentas Claras

Canal de YouTube del despacho S & I Castro Consultores (`youtube.com/@cuentasclaras_mx`,
antes `@todoconta`), patrocinado por TodoConta. Su sitio está en `sitio/` (Astro, `cc.sicastro.com`).

| Carpeta | Qué hay |
|---|---|
| [`docs/estrategia.md`](docs/estrategia.md) | El giro del 2026-10-26, avatar, datos del canal, pilares, formato de series, la escalera de venta y la serie 1 |
| [`design/DESIGN.md`](design/DESIGN.md) | **La identidad vigente (v2)**: la libreta de fondo, el rosa de acento, el billete palomeado. Historia de las rondas |
| [`design/tableros/identidad-v2.html`](design/tableros/identidad-v2.html) | El tablero de la v2. Banner e ícono en `design/salidas/` |
| `design/simbolo.svg`, `design/simbolo-oscuro.svg` | El símbolo suelto, para usarlo en cualquier lado |
| [`design/tableros/exploracion-recorte.html`](design/tableros/exploracion-recorte.html) | Qué va detrás del recorte en las miniaturas (decidido: nada, solo la sombra) |
| `design/tableros/` (lo demás) | Registro: las tres direcciones, la v1, Acuse en cuatro pieles, los cuatro símbolos |
| `design/salidas/` | Capturas de los tableros. Se regeneran con Chrome sin interfaz (ver abajo) |
| [`sitio/`](sitio/README.md) | El sitio: portada con la guía gratis, `/agendar` (precalificación de la consulta), design system en `/sistema` |
| `design/historias/` | Historias destacadas de Instagram (`generar.py` + `exportar.sh`) |
| [`docs/`](docs/) | Estrategia, banco de series, guía, guiones de historias, calendario de la consulta |

Para regenerar una captura:

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --hide-scrollbars \
  --virtual-time-budget=8000 --window-size=1440,3900 \
  --screenshot=design/salidas/b-senaletica.png "file://$PWD/design/tableros/b-senaletica.html"
```

Con `#miniaturas` al final de la URL, el tablero se reduce a sus tres miniaturas apiladas (así salen
las imágenes del índice, con `--window-size=540,920`).

La identidad es propia: no comparte tipografía ni color con soycontador.ai, TodoConta ni
sicastro.com.
