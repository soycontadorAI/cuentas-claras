/** Calculadora de la portada: deducción × tasa marginal. No pide nada ni manda nada. */

import { medir } from '../lib/medir';

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

  const brinca = () => {
    if (quieto) return;
    cRegresa.classList.remove('pop');
    void (cRegresa as HTMLElement).offsetWidth;
    cRegresa.classList.add('pop');
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

  // Quién juega con la calculadora y con qué rango de deducción. Hasta 6 por visita, y solo al
  // soltar el control: el arrastre no inunda GA. Son números del ejemplo, no de la persona.
  let usos = 0;
  const reportar = () => {
    if (usos >= 6) return;
    usos += 1;
    medir('calculadora_usada', { uso: usos, deduccion: Number(rango.value), tasa, regresa: Math.round((Number(rango.value) * tasa) / 100) });
  };

  rango.addEventListener('input', () => { calcular(); brinca(); });
  rango.addEventListener('change', reportar);
  botones.forEach((b) =>
    b.addEventListener('click', () => {
      botones.forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      tasa = Number(b.dataset.tasa);
      calcular();
      brinca();
      reportar();
    }),
  );
  calcular();
}
