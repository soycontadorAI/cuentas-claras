/**
 * POST /api/agendar
 *
 * Último paso de la precalificación: vuelve a correr la regla (lo que llega del navegador no se
 * cree), avisa al despacho por correo y da de alta al prospecto en la lista "diagnostico" de Sendy.
 * Si pasa, responde con el enlace de la página de citas (que cobra con Stripe al reservar).
 *
 * Body:      { tema, situacion, ingreso, busca, cuando, caso, nombre, correo, whatsapp, acepto, hp? }
 * Respuesta: { ok: true, reserva } | { ok: false, salida } | { ok: false, error }
 *
 * Si el correo o Sendy fallan, la persona igual recibe el enlace: a quien ya decidió pagar no se
 * le detiene por un aviso interno. Se registra en el log para revisarlo.
 */

import type { APIRoute } from 'astro';
import { z } from 'astro/zod';

import { BUSCA, CUANDO, INGRESO, SITUACION, TEMA, prioridad, salida } from '../../lib/agendar';
import { EMAIL_RE, json, leerJson, metodoNoPermitido, texto, whatsappMx } from '../../lib/api';
import { correoConfigurado, enviar } from '../../lib/correo';
import { correoAgendar } from '../../lib/correo-agendar';
import { RESERVA_URL } from '../../lib/sitio';
import { sendyConfigurado, suscribir } from '../../lib/sendy';

export const prerender = false;

const clave = <T extends Record<string, string>>(o: T) => z.enum(Object.keys(o) as [keyof T & string, ...(keyof T & string)[]]);

const Esquema = z.object({
  tema: clave(TEMA),
  situacion: clave(SITUACION),
  ingreso: clave(INGRESO),
  busca: clave(BUSCA),
  cuando: clave(CUANDO),
  caso: z.string().trim().min(20, 'Cuéntanos tu caso en dos o tres líneas.').max(1500),
  nombre: z.string().trim().min(2, 'Escribe tu nombre.').max(80),
  correo: z.string().trim().toLowerCase().max(200).regex(EMAIL_RE, 'Revisa tu correo.'),
  whatsapp: z.string().trim().max(20),
  acepto: z.literal(true, { message: 'Falta aceptar el aviso de privacidad.' }),
});

export const POST: APIRoute = async ({ request }) => {
  const raw = await leerJson(request);
  if (!raw) return json(400, { ok: false, error: 'No pudimos leer el formulario.' });
  if (texto(raw.hp, 200)) return json(200, { ok: true, reserva: RESERVA_URL });

  const r = Esquema.safeParse(raw);
  if (!r.success) return json(400, { ok: false, error: r.error.issues[0]?.message ?? 'Revisa tus respuestas.' });
  const d = r.data;

  const whatsapp = whatsappMx(d.whatsapp);
  if (!whatsapp) return json(400, { ok: false, error: 'El WhatsApp va a 10 dígitos.' });

  const s = salida(d);
  if (s) return json(200, { ok: false, salida: s });

  const datos = { ...d, whatsapp, origen: request.headers.get('referer') ?? 'cc.sicastro.com/agendar' };
  const p = prioridad(d);

  if (correoConfigurado) {
    const enviado = await enviar(correoAgendar(datos, p));
    if (!enviado) console.error('[agendar] no salió el aviso interno de', d.correo);
  } else {
    console.info(`[agendar] ${import.meta.env.DEV ? 'SIMULADO' : 'SIN SES'}: aviso de ${d.nombre} <${d.correo}> (${p})`);
  }

  if (sendyConfigurado('diagnostico')) {
    const st = await suscribir({
      lista: 'diagnostico',
      email: d.correo,
      nombre: d.nombre,
      campos: { Whatsapp: whatsapp, Regimen: SITUACION[d.situacion], Interes: 'Consulta 1:1', RangoInterno: INGRESO[d.ingreso], Origen: 'cc.sicastro.com/agendar' },
    });
    if (st === 'error') console.error('[agendar] Sendy no dio de alta a', d.correo);
  }

  return json(200, { ok: true, reserva: RESERVA_URL });
};

export const ALL: APIRoute = metodoNoPermitido;
