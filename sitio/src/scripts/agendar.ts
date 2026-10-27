/**
 * La precalificación de /agendar en el navegador: un paso a la vez, avanza solo al escoger, y
 * en cuanto las respuestas llevan a una salida, la muestra (sin pedir datos de contacto).
 * El servidor vuelve a decidir con la misma regla (src/lib/agendar.ts).
 */

import { DESTINOS, salida, type Respuestas } from '../lib/agendar';
import { medir } from '../lib/medir';
import { paraMedicion } from '../lib/origen';
import { whatsappUrl } from '../lib/sitio';
import { reducido } from './movimiento';

export function iniciarAgendar(): void {
  const raiz = document.getElementById('calificador');
  const form = document.getElementById('form-agendar') as HTMLFormElement | null;
  if (!raiz || !form) return;

  const pasos = [...form.querySelectorAll<HTMLFieldSetElement>('[data-paso]')];
  const puntos = [...raiz.querySelectorAll<HTMLElement>('[data-punto]')];
  const numero = raiz.querySelector('[data-numero]')!;
  const panelSalida = document.getElementById('salida')!;
  const panelPasa = document.getElementById('pasa')!;
  const error = form.querySelector<HTMLElement>('[data-error]')!;
  const boton = form.querySelector<HTMLButtonElement>('button[type="submit"]')!;
  let actual = 0;
  // Cada paso cuenta una vez por visita (volver atrás no infla el embudo). Va el número, nunca la
  // respuesta: la respuesta es del caso de la persona.
  const pasosVistos = new Set<number>();
  const medirPaso = (n: number) => {
    if (pasosVistos.has(n)) return;
    pasosVistos.add(n);
    medir('agendar_paso', { paso: n + 1, de: pasos.length });
  };

  const respuestas = (): Respuestas => {
    const fd = new FormData(form);
    const r: Record<string, string> = {};
    for (const k of ['tema', 'situacion', 'ingreso', 'busca', 'cuando']) {
      const v = fd.get(k);
      if (typeof v === 'string') r[k] = v;
    }
    return r as Respuestas;
  };

  const ir = (n: number, enfocar = true) => {
    actual = n;
    pasos.forEach((p, i) => (p.hidden = i !== n));
    puntos.forEach((p, i) => p.classList.toggle('hecho', i <= n));
    numero.textContent = String(n + 1);
    medirPaso(n);
    form.hidden = false;
    panelSalida.hidden = true;
    panelPasa.hidden = true;
    if (!enfocar) return;
    const primero = pasos[n].querySelector<HTMLElement>('input:checked, input, textarea');
    // Al volver o avanzar se lleva el foco al paso nuevo sin brincar la página en el teléfono
    primero?.focus({ preventScroll: true });
    if (innerWidth < 900) raiz.scrollIntoView({ behavior: reducido() ? 'auto' : 'smooth', block: 'start' });
  };

  const mostrarSalida = (s: NonNullable<ReturnType<typeof salida>>) => {
    // Solo la categoría de la salida (tramite, empresa, paquete-anual...), no las respuestas.
    medir('agendar_resultado', { resultado: 'salida', salida: s, ...paraMedicion() });
    const d = DESTINOS[s];
    panelSalida.querySelector('[data-titulo]')!.textContent = d.titulo;
    panelSalida.querySelector('[data-texto]')!.textContent = d.texto;
    const b = panelSalida.querySelector<HTMLAnchorElement>('[data-boton]')!;
    b.textContent = d.boton;
    b.href = d.url;
    const otra = panelSalida.querySelector<HTMLAnchorElement>('[data-otra]')!;
    otra.hidden = !d.otra;
    if (d.otra) { otra.textContent = d.otra.texto; otra.href = d.otra.url; }
    form.hidden = true;
    panelSalida.hidden = false;
    puntos.forEach((p) => p.classList.add('hecho'));
    panelSalida.focus();
  };

  form.addEventListener('change', (e) => {
    const campo = e.target as HTMLInputElement;
    if (campo.type !== 'radio') return;
    const s = salida(respuestas());
    // Una pausa corta para que se vea la palomita antes de cambiar de pregunta
    setTimeout(() => (s ? mostrarSalida(s) : ir(actual + 1)), reducido() ? 0 : 320);
  });

  form.addEventListener('click', (e) => {
    if ((e.target as HTMLElement).closest('[data-atras]')) ir(Math.max(0, actual - 1));
  });
  panelSalida.querySelector('[data-reiniciar]')!.addEventListener('click', () => ir(0));

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    error.hidden = true;
    form.querySelectorAll('[aria-invalid]').forEach((c) => c.removeAttribute('aria-invalid'));
    const el = (n: string) => form.elements.namedItem(n) as HTMLInputElement;
    const falta = (campo: HTMLInputElement, msg: string) => {
      campo.setAttribute('aria-invalid', 'true');
      error.textContent = msg;
      error.hidden = false;
      campo.focus();
    };
    if (el('caso').value.trim().length < 20) return falta(el('caso'), 'Cuéntanos tu caso en dos o tres líneas.');
    if (el('nombre').value.trim().length < 2) return falta(el('nombre'), 'Escribe tu nombre.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(el('correo').value.trim())) return falta(el('correo'), 'Revisa tu correo.');
    if (el('whatsapp').value.replace(/\D/g, '').replace(/^52/, '').length !== 10) return falta(el('whatsapp'), 'El WhatsApp va a 10 dígitos.');
    if (!el('acepto').checked) return falta(el('acepto'), 'Falta aceptar el aviso de privacidad.');

    boton.disabled = true;
    boton.textContent = 'Un momento…';
    try {
      const resp = await fetch('/api/agendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...respuestas(),
          caso: el('caso').value,
          nombre: el('nombre').value,
          correo: el('correo').value,
          whatsapp: el('whatsapp').value,
          acepto: el('acepto').checked,
          hp: el('sitio').value,
        }),
      });
      const datos = (await resp.json().catch(() => ({}))) as { ok?: boolean; reserva?: string; salida?: Parameters<typeof mostrarSalida>[0]; error?: string };
      if (datos.salida) return mostrarSalida(datos.salida);
      if (!resp.ok || !datos.ok || !datos.reserva) throw new Error(datos.error || 'Algo falló de nuestro lado.');
      panelPasa.querySelector<HTMLAnchorElement>('[data-reserva]')!.href = datos.reserva;
      const nombre = el('nombre').value.trim().split(/\s+/)[0];
      panelPasa.querySelector<HTMLAnchorElement>('[data-transferencia]')!.href = whatsappUrl(
        `Hola, soy ${nombre}. Pasé la precalificación de la consulta 1:1 y quiero pagar por transferencia.`,
      );
      medir('agendar_resultado', { resultado: 'pasa', ...paraMedicion() });
      form.hidden = true;
      panelPasa.hidden = false;
      puntos.forEach((p) => p.classList.add('hecho'));
      panelPasa.focus();
    } catch (err) {
      error.textContent = `${(err as Error).message} Inténtalo de nuevo o escríbenos por WhatsApp.`;
      error.hidden = false;
    } finally {
      boton.disabled = false;
      boton.textContent = 'Ver horarios';
    }
  });

  ir(0, false);
}
