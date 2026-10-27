/** Formulario de "La hoja del año": valida, manda a /api/guia y celebra con billetes. */

import { lluviaDeBilletes } from './movimiento';

const CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function iniciarGuia(): void {
  const form = document.getElementById('form-guia') as HTMLFormElement | null;
  if (!form) return;
  const listo = document.getElementById('listo-guia')!;
  const error = form.querySelector<HTMLElement>('[data-error]')!;
  const boton = form.querySelector<HTMLButtonElement>('button[type="submit"]')!;

  const marcar = (campo: HTMLInputElement, msg: string) => {
    campo.setAttribute('aria-invalid', 'true');
    error.textContent = msg;
    error.hidden = false;
    campo.focus();
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    error.hidden = true;
    form.querySelectorAll('[aria-invalid]').forEach((c) => c.removeAttribute('aria-invalid'));
    const nombre = form.elements.namedItem('nombre') as HTMLInputElement;
    const correo = form.elements.namedItem('correo') as HTMLInputElement;
    const whatsapp = form.elements.namedItem('whatsapp') as HTMLInputElement;
    const hp = form.elements.namedItem('sitio') as HTMLInputElement;
    if (nombre.value.trim().length < 2) return marcar(nombre, 'Escribe tu nombre.');
    if (!CORREO.test(correo.value.trim())) return marcar(correo, 'Revisa tu correo.');
    const wa = whatsapp.value.replace(/\D/g, '');
    if (wa && wa.replace(/^52/, '').length !== 10) return marcar(whatsapp, 'El WhatsApp va a 10 dígitos (o déjalo vacío).');

    boton.disabled = true;
    boton.textContent = 'Enviando…';
    try {
      const resp = await fetch('/api/guia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: nombre.value, correo: correo.value, whatsapp: whatsapp.value, hp: hp.value }),
      });
      const datos = (await resp.json().catch(() => ({}))) as { ok?: boolean; status?: string; error?: string };
      if (!resp.ok || !datos.ok) throw new Error(datos.error || 'No pudimos registrarte en este momento.');
      lluviaDeBilletes(boton);
      const pila = nombre.value.trim().split(/\s+/)[0];
      listo.querySelector('p')!.textContent =
        datos.status === 'already'
          ? `${pila}, ya estabas en la lista. Busca la guía en tu correo (también en Promociones).`
          : `Gracias, ${pila}. Te mandamos un correo para confirmar: en cuanto le des clic, te llega la guía. Si no lo ves, busca en Promociones.`;
      form.hidden = true;
      listo.hidden = false;
      listo.focus();
    } catch (err) {
      error.textContent = (err as Error).message;
      error.hidden = false;
      boton.disabled = false;
      boton.textContent = 'Mándamela';
    }
  });
}
