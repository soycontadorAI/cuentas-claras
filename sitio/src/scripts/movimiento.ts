/**
 * El movimiento del sitio, sin librerías: lo que antes hacía GSAP en el boceto se hace con CSS
 * (transiciones y animaciones ligadas al scroll) y este archivo solo decide cuándo.
 *
 * - [data-entra], [data-resalta], [data-palomea]: reciben .visto al entrar a la pantalla.
 * - [data-magnetico]: el botón se va un poco hacia el puntero (solo con mouse).
 * - lluviaDeBilletes(): los billetes que salen del botón al suscribirse. Es la ÚNICA vez que hay
 *   billetes en pantalla; nunca siguen al cursor (Israel, 2026-10-26: "eso cansa").
 */

export const reducido = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

export function iniciar(): void {
  const barra = document.getElementById('barra');
  if (barra) {
    const fondo = () => barra.classList.toggle('fondo', scrollY > 12);
    addEventListener('scroll', fondo, { passive: true });
    fondo();
  }

  const vigilados = document.querySelectorAll<HTMLElement>('[data-entra], [data-resalta], [data-palomea]');
  if (reducido() || !('IntersectionObserver' in window)) {
    vigilados.forEach((el) => el.classList.add('visto'));
  } else {
    const io = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          if (!e.isIntersecting) continue;
          e.target.classList.add('visto');
          io.unobserve(e.target);
        }
      },
      { rootMargin: '0px 0px -15% 0px' },
    );
    vigilados.forEach((el) => io.observe(el));
  }

  if (!reducido() && matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll<HTMLElement>('[data-magnetico]').forEach((b) => {
      b.addEventListener('pointermove', (e) => {
        const r = b.getBoundingClientRect();
        b.style.setProperty('--mx', `${(e.clientX - r.left - r.width / 2) * 0.22}px`);
        b.style.setProperty('--my', `${(e.clientY - r.top - r.height / 2) * 0.3}px`);
      });
      b.addEventListener('pointerleave', () => {
        b.style.setProperty('--mx', '0px');
        b.style.setProperty('--my', '0px');
      });
    });
  }
}

const azar = (a: number, b: number) => a + Math.random() * (b - a);

export function lluviaDeBilletes(origen: Element): void {
  if (reducido() || !('animate' in Element.prototype)) return;
  const r = origen.getBoundingClientRect();
  const x0 = r.left + r.width / 2 - 28;
  const y0 = r.top + r.height / 2 - 28;
  for (let i = 0; i < 18; i++) {
    const b = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    b.setAttribute('class', 'billetito');
    b.setAttribute('aria-hidden', 'true');
    b.innerHTML = '<use href="#billete"/>';
    document.body.appendChild(b);
    const ang = azar(-Math.PI * 0.95, -Math.PI * 0.05);
    const vel = azar(160, 380);
    const dx = Math.cos(ang) * vel;
    const dy = Math.sin(ang) * vel;
    const caida = azar(260, 420);
    const g0 = azar(-40, 40);
    const g1 = g0 + azar(-200, 200);
    const g2 = g1 + azar(-120, 120);
    const s = azar(0.6, 1.1);
    const t = (x: number, y: number, g: number) => `translate(${x0 + x}px, ${y0 + y}px) rotate(${g}deg) scale(${s})`;
    b.animate(
      [
        { transform: t(0, 0, g0), opacity: 1, offset: 0, easing: 'cubic-bezier(.2,.7,.3,1)' },
        { transform: t(dx, dy, g1), opacity: 1, offset: 0.35, easing: 'cubic-bezier(.5,0,.9,.6)' },
        { transform: t(dx * 1.15, dy + caida, g2), opacity: 0, offset: 1 },
      ],
      { duration: 2000, fill: 'forwards' },
    ).finished.then(() => b.remove());
  }
}
