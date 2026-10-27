/**
 * POST /api/guia
 *
 * Captura de la portada: alta en la lista "guia" de Sendy (DOBLE opt-in). Sendy manda la
 * confirmación y el autoresponder entrega "La guía".
 *
 * Body:      { nombre, correo, whatsapp?, hp? }
 * Respuesta: { ok, status: 'confirm' | 'already' | 'invalido' | 'error', error?, simulado? }
 *
 * Sin Sendy configurado: en `astro dev` responde ok con `simulado: true`; en producción, 503.
 */

import type { APIRoute } from 'astro';
import { z } from 'astro/zod';

import { EMAIL_RE, json, leerJson, metodoNoPermitido, respaldo, texto, whatsappMx } from '../../lib/api';
import { sendyConfigurado, suscribir } from '../../lib/sendy';

export const prerender = false;

const Esquema = z.object({
  nombre: z.string().trim().min(2, 'Escribe tu nombre.').max(80),
  correo: z.string().trim().toLowerCase().max(200).regex(EMAIL_RE, 'Revisa tu correo.'),
  whatsapp: z.string().trim().max(20).optional().default(''),
});

export const POST: APIRoute = async ({ request }) => {
  const raw = await leerJson(request);
  if (!raw) return json(400, { ok: false, status: 'invalido', error: 'No pudimos leer el formulario.' });

  // Honeypot: un bot llenó el campo invisible. Se le contesta como si todo saliera bien.
  if (texto(raw.hp, 200)) return json(200, { ok: true, status: 'confirm' });

  const r = Esquema.safeParse(raw);
  if (!r.success) return json(400, { ok: false, status: 'invalido', error: r.error.issues[0]?.message ?? 'Revisa tus datos.' });

  const whatsapp = r.data.whatsapp ? whatsappMx(r.data.whatsapp) : '';
  if (whatsapp === null) return json(400, { ok: false, status: 'invalido', error: 'El WhatsApp va a 10 dígitos (o déjalo vacío).' });

  if (!sendyConfigurado('guia')) {
    if (import.meta.env.DEV) {
      console.info('[guia] SIMULADO (sin Sendy):', r.data.correo);
      return json(200, { ok: true, status: 'confirm', simulado: true });
    }
    return json(503, { ok: false, status: 'error', error: `No pudimos registrarte en este momento. ${respaldo}` });
  }

  const status = await suscribir({
    lista: 'guia',
    email: r.data.correo,
    nombre: r.data.nombre,
    referrer: request.headers.get('referer') ?? undefined,
    campos: { Whatsapp: whatsapp, Origen: 'cc.sicastro.com' },
  });
  if (status === 'invalido') return json(400, { ok: false, status, error: 'Esa dirección no pasó la validación. Revísala o prueba con otra.' });
  if (status === 'error') return json(502, { ok: false, status, error: `No pudimos registrarte en este momento. ${respaldo}` });
  return json(200, { ok: true, status });
};

export const ALL: APIRoute = metodoNoPermitido;
