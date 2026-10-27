#!/bin/zsh
# Exporta cada pieza de tableros/historias.html a salidas/historias/<id>.png.
# Historias y portadas: 1080 × 1920. Foto de perfil: 1080 × 1080.
# Antes: python3 design/historias/generar.py
cd "$(dirname "$0")/.."
mkdir -p salidas/historias
una() {
  local id=$1 tam=1080,1920
  [[ $id == t-perfil-* ]] && tam=1080,1080
  # perl alarm: a veces Chrome sin interfaz se queda colgado; a los 45 s se corta y se reintenta
  for intento in 1 2; do
    perl -e 'alarm 45; exec @ARGV' "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
      --headless=new --hide-scrollbars --force-prefers-reduced-motion --virtual-time-budget=8000 \
      --user-data-dir="$(mktemp -d)" --window-size=$tam --screenshot="salidas/historias/${id#t-}.png" \
      "file://$PWD/tableros/historias.html#solo=$id" 2>/dev/null && return 0
  done
  echo "falló: $id"
}
for id in $(cat historias/ids.txt); do una $id & ; (( $(jobs | wc -l) >= 4 )) && wait -n 2>/dev/null || true; done
wait
ls salidas/historias/*.png | wc -l
