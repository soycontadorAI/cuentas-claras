/**
 * Comportamiento dentro de la página: hasta dónde baja la gente, qué secciones ve, cuánto se
 * queda, qué pregunta abre, en qué formulario empieza y dónde lo suelta. Lo monta Analytics.astro
 * (solo con IDs puestos y en producción). Los eventos de cada flujo (guía, agenda, calculadora)
 * viven en su propio script; aquí está lo transversal.
 *
 * Mismas reglas que medir.ts: solo categorías, rutas y nombres de campo. Nunca lo que la persona
 * escribió ni lo que contestó.
 */
import { medir } from './medir';

const una = new Set<string>();
/** Deja pasar cada clave una sola vez por carga de página. */
const primera = (clave: string): boolean => {
  if (una.has(clave)) return false;
  una.add(clave);
  return true;
};

/** Los bloques con id de la portada (celdas y cajones) y las secciones sueltas; no los paneles de resultado. */
export const SECCIONES = 'main :is(.cel, .cajones, section):not(.resultado)[id]';

const pagina = () => location.pathname;

/** Cuánto de la página ya pasó por la pantalla: 25, 50, 75 y 100 %. */
function profundidad(): void {
  const cortes = [25, 50, 75, 100];
  let pendiente = false;
  const revisar = () => {
    pendiente = false;
    const doc = document.documentElement;
    const alto = doc.scrollHeight;
    if (alto <= 0) return;
    const visto = ((window.scrollY + window.innerHeight) / alto) * 100;
    for (const c of cortes) {
      // El 100 admite un margen: en el celular casi nunca llega al último píxel.
      if (visto >= (c === 100 ? 98 : c) && primera(`scroll${c}`)) {
        medir('scroll_profundidad', { porcentaje: c, pagina: pagina() });
      }
    }
  };
  addEventListener(
    'scroll',
    () => {
      if (pendiente) return;
      pendiente = true;
      requestAnimationFrame(revisar);
    },
    { passive: true },
  );
}

/** Qué secciones de la página llegaron a la parte media de la pantalla. */
function secciones(): void {
  const lista = document.querySelectorAll<HTMLElement>(SECCIONES);
  if (!lista.length || !('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver(
    (entradas) => {
      for (const e of entradas) {
        if (!e.isIntersecting) continue;
        io.unobserve(e.target);
        medir('seccion_vista', { seccion: e.target.id, pagina: pagina() });
      }
    },
    // Una franja del 40 % central: sirve igual para una sección corta o para una de tres pantallas.
    { rootMargin: '-30% 0px -30% 0px', threshold: 0 },
  );
  lista.forEach((s) => io.observe(s));
}

/** Tiempo con la pestaña a la vista (el de GA4 mide actividad; este marca hitos legibles). */
function permanencia(): void {
  const hitos = [15, 30, 60, 120, 300];
  let segundos = 0;
  setInterval(() => {
    if (document.visibilityState !== 'visible') return;
    segundos += 1;
    if (hitos.includes(segundos)) medir('permanencia', { segundos, pagina: pagina() });
  }, 1000);
}

/** Qué pregunta abre la gente en la portada. */
function preguntas(): void {
  let tocado = false;
  // El primer details viene abierto: sus toggle del arranque no cuentan, solo los de una persona.
  const marcar = () => (tocado = true);
  addEventListener('pointerdown', marcar, { capture: true, once: true });
  addEventListener('keydown', marcar, { capture: true, once: true });
  // toggle no burbujea: hay que escucharlo en captura.
  document.addEventListener(
    'toggle',
    (e) => {
      const d = e.target;
      if (!tocado || !(d instanceof HTMLDetailsElement) || !d.open) return;
      const texto = d.querySelector('summary')?.textContent?.trim().slice(0, 80);
      if (texto && primera(`pregunta:${texto}`)) medir('pregunta_abierta', { pregunta: texto, pagina: pagina() });
    },
    true,
  );
}

const empezados = new Map<string, string>();

/** El formulario terminó (alta, salida o resultado): ya no cuenta como abandonado. */
export function formularioCompleto(formulario: string): void {
  // En el DOM y no en una variable del módulo: no depende de que todos los scripts compartan módulo.
  document.getElementById(`form-${formulario}`)?.setAttribute('data-completo', '');
}

/** Un error de validación o de servidor. `campo` es el nombre del campo, nunca su contenido. */
export function formularioError(formulario: string, campo: string): void {
  medir('formulario_error', { formulario, campo });
}

/**
 * Empezó (primer foco en un campo) y abandonó (se fue sin terminar, con el último campo tocado).
 * El abandono sale al ocultarse la página: en el celular es lo único confiable.
 */
function formularios(): void {
  for (const [id, nombre] of [['form-guia', 'guia'], ['form-agendar', 'agendar']] as const) {
    const form = document.getElementById(id);
    if (!form) continue;
    form.addEventListener('focusin', (e) => {
      const campo = e.target as HTMLInputElement;
      const cual = campo.name || campo.id || 'campo';
      if (primera(`inicio:${nombre}`)) medir('formulario_inicio', { formulario: nombre, pagina: pagina() });
      empezados.set(nombre, cual);
    });
  }
  const salida = () => {
    for (const [nombre, ultimo] of empezados) {
      if (document.getElementById(`form-${nombre}`)?.hasAttribute('data-completo') || !primera(`abandono:${nombre}`)) continue;
      medir('formulario_abandonado', { formulario: nombre, ultimo_campo: ultimo, pagina: pagina() });
    }
  };
  addEventListener('pagehide', salida);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') salida();
  });
}

/** Errores de JavaScript en el navegador de la gente: lo que se rompe sin que nadie avise. */
function errores(): void {
  let n = 0;
  addEventListener('error', (e) => {
    if (n >= 3) return;
    n += 1;
    medir('error_js', {
      mensaje: String(e.message || 'sin mensaje').slice(0, 100),
      archivo: String(e.filename || '').split('/').pop()?.slice(0, 60),
      linea: e.lineno,
      pagina: pagina(),
    });
  });
}

export function iniciarComportamiento(): void {
  profundidad();
  secciones();
  permanencia();
  preguntas();
  formularios();
  errores();
}
