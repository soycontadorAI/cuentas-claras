// ?principal=RRGGBB&hondo=RRGGBB cambia el color principal (el rosa) sin tocar tokens.css:
// sirve para probar alternativas de color sobre las mismas piezas.
{
  const q = new URLSearchParams(location.search);
  if (q.get('principal')) document.documentElement.style.setProperty('--rosa', '#' + q.get('principal'));
  if (q.get('hondo')) document.documentElement.style.setProperty('--rosa-hondo', '#' + q.get('hondo'));
}

// Cada pieza se escribe una sola vez en un <template> a tamaño nativo; aquí se clona en cada marco
// que la pide (data-tpl), así la miniatura grande y la de 168 px son exactamente la misma.
for (const marco of document.querySelectorAll('[data-tpl]')) {
  const tpl = document.getElementById(marco.dataset.tpl);
  const nativo = document.createElement('div');
  nativo.className = 'native';
  nativo.append(tpl.content.cloneNode(true));
  marco.prepend(nativo);
}

// Con #miniaturas la página se reduce a sus tres miniaturas apiladas: de ahí sale la imagen del índice.
if (location.hash === '#miniaturas') {
  const caja = document.createElement('div');
  caja.style.cssText = 'display:grid;gap:14px;padding:14px;background:#F3F3F1;width:max-content';
  for (const marco of [...document.querySelectorAll('.frame[data-tpl^="t-th"]')].slice(0, 3)) {
    const copia = marco.cloneNode(true);
    copia.style.setProperty('--s', '.4');
    caja.append(copia);
  }
  // Las definiciones SVG (flechas, filtro de tinta) se quedan: las piezas las referencian.
  document.body.replaceChildren(...document.body.querySelectorAll(':scope > svg'), caja);
}

// Con #solo=<id de template> la página muestra solo esa pieza a tamaño nativo, sin marco ni guías:
// así se exportan el banner y el ícono para subirlos tal cual.
if (location.hash.startsWith('#solo=')) {
  const id = location.hash.slice(6);
  const marco = document.querySelector(`.frame[data-tpl="${id}"]`);
  const pieza = document.createElement('div');
  pieza.style.cssText = `position:relative;overflow:hidden;width:${marco.style.getPropertyValue('--w')}px;height:${marco.style.getPropertyValue('--h')}px`;
  pieza.append(document.getElementById(id).content.cloneNode(true));
  document.documentElement.classList.add('solo');
  document.body.style.margin = '0';
  document.body.replaceChildren(...document.body.querySelectorAll(':scope > svg'), pieza);
}
