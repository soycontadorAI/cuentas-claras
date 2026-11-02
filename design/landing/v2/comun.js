/* Compartido por las tres variantes: sprite del billete, revelado al entrar y la calculadora. */
(() => {
  document.body.insertAdjacentHTML('afterbegin', `<svg width="0" height="0" style="position:absolute" aria-hidden="true">
    <symbol id="billete" viewBox="0 0 200 200"><rect x="14" y="50" width="172" height="100" rx="14" fill="#FFF6E8" stroke="#3B2418" stroke-width="11"/><rect x="32" y="66" width="136" height="68" rx="6" fill="none" stroke="#3B2418" stroke-width="4"/><circle cx="100" cy="100" r="27" fill="#E4007C"/><path d="M86 101l10 10 19-21" fill="none" stroke="#FFF6E8" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/><circle cx="48" cy="100" r="6" fill="#3B2418"/><circle cx="152" cy="100" r="6" fill="#3B2418"/></symbol>
    <symbol id="yt" viewBox="0 0 28 20"><rect width="28" height="20" rx="6" fill="#E4007C"/><path d="M11 6l7 4-7 4z" fill="#FFF6E8"/></symbol></svg>`);

  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('visto'); io.unobserve(e.target); } }), { threshold: 0.12 });
  document.querySelectorAll('[data-entra],[data-resalta],[data-palomea]').forEach((el) => io.observe(el));

  /* Calculadora: deducción x tasa marginal. No pide ni manda nada. */
  const mxn = (n) => '$' + Math.round(n).toLocaleString('es-MX');
  const $ = (s) => document.querySelector(s);
  const rango = $('#deduce');
  if (!rango) return;
  const botones = [...document.querySelectorAll('[data-tasa]')];
  let tasa = Number(botones.find((b) => b.getAttribute('aria-pressed') === 'true')?.dataset.tasa ?? 21.36);
  const poner = (sel, txt) => document.querySelectorAll(sel).forEach((n) => (n.textContent = txt));
  const calcular = () => {
    const d = Number(rango.value);
    rango.style.setProperty('--p', `${((d - rango.min) / (rango.max - rango.min)) * 100}%`);
    poner('[data-monto]', mxn(d));
    poner('[data-tasa-txt]', `${tasa}%`);
    poner('[data-regresa]', mxn((d * tasa) / 100));
  };
  rango.addEventListener('input', calcular);
  botones.forEach((b) => b.addEventListener('click', () => { botones.forEach((x) => x.setAttribute('aria-pressed', String(x === b))); tasa = Number(b.dataset.tasa); calcular(); }));
  calcular();
})();
