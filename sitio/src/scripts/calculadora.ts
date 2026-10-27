/** Calculadora de la portada: deducción × tasa marginal. No pide nada ni manda nada. */

const mxn = (n: number) => '$' + Math.round(n).toLocaleString('es-MX');

export function iniciarCalculadora(): void {
  const raiz = document.getElementById('calcula');
  if (!raiz) return;
  const rango = raiz.querySelector<HTMLInputElement>('#deduce')!;
  const botones = [...raiz.querySelectorAll<HTMLButtonElement>('[data-tasa]')];
  const monto = raiz.querySelector('#monto')!;
  const cDeduce = raiz.querySelector('#c-deduce')!;
  const cTasa = raiz.querySelector('#c-tasa')!;
  const cRegresa = raiz.querySelector('#c-regresa')!;
  const quieto = matchMedia('(prefers-reduced-motion: reduce)').matches;

  let tasa = Number(botones.find((b) => b.getAttribute('aria-pressed') === 'true')?.dataset.tasa ?? 21.36);
  let mostrado = Number(rango.value) * tasa / 100;
  let cuadro = 0;

  const contar = (destino: number) => {
    cancelAnimationFrame(cuadro);
    if (quieto) { mostrado = destino; cRegresa.textContent = mxn(destino); return; }
    const desde = mostrado;
    const t0 = performance.now();
    const paso = (ahora: number) => {
      const p = Math.min(1, (ahora - t0) / 500);
      mostrado = desde + (destino - desde) * (1 - (1 - p) ** 3);
      cRegresa.textContent = mxn(mostrado);
      if (p < 1) cuadro = requestAnimationFrame(paso);
    };
    cuadro = requestAnimationFrame(paso);
  };

  const calcular = () => {
    const d = Number(rango.value);
    const min = Number(rango.min), max = Number(rango.max);
    rango.style.setProperty('--p', `${((d - min) / (max - min)) * 100}%`);
    monto.textContent = mxn(d);
    cDeduce.textContent = mxn(d);
    cTasa.textContent = `${tasa}%`;
    rango.setAttribute('aria-valuetext', mxn(d));
    contar((d * tasa) / 100);
  };

  rango.addEventListener('input', calcular);
  botones.forEach((b) =>
    b.addEventListener('click', () => {
      botones.forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      tasa = Number(b.dataset.tasa);
      calcular();
    }),
  );
  calcular();
}
