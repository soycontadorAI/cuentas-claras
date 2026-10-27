#!/bin/zsh
# Recorta Bricolage Grotesque a lo que usa el sitio (Lighthouse: la fuente completa pesa 131 KB y
# retrasaba el LCP en celular). Ejes: opsz completo, wght 400-800, wdth 88-100. Caracteres: latín
# básico, las letras del español (acentos, ñ, ü, ¿, ¡) y la puntuación tipográfica. Si el sitio
# llega a usar otro carácter, se agrega a --unicodes y se vuelve a correr. Requiere fonttools + brotli:
#   python3 -m venv /tmp/ft && /tmp/ft/bin/pip install fonttools brotli
#   PY=/tmp/ft/bin/python herramientas/fuente.sh
set -e
cd "$(dirname "$0")/.."
PY=${PY:-python3}
ORIGEN=node_modules/@fontsource-variable/bricolage-grotesque/files/bricolage-grotesque-latin-standard-normal.woff2
$PY -m fontTools.varLib.instancer "$ORIGEN" wght=400:800 wdth=88:100 -o /tmp/bricolage-instancia.ttf
$PY -m fontTools.subset /tmp/bricolage-instancia.ttf \
  --unicodes="U+0020-007E,U+00A0,U+00A1,U+00AB,U+00B0,U+00B7,U+00BB,U+00BF,U+00C1,U+00C9,U+00CD,U+00D1,U+00D3,U+00DA,U+00DC,U+00E1,U+00E9,U+00ED,U+00F1,U+00F3,U+00FA,U+00FC,U+00D7,U+2013,U+2014,U+2018,U+2019,U+201C,U+201D,U+2022,U+2026,U+2190-2193" \
  --layout-features="kern,tnum" --flavor=woff2 --output-file=src/assets/fuentes/bricolage-cc.woff2
ls -la src/assets/fuentes/bricolage-cc.woff2
