/**
 * Aviso interno de cada precalificación que pasa a la consulta. Llega antes que el pago: si la
 * persona no termina de reservar en Google Calendar, el despacho tiene con qué escribirle.
 */

import { BUSCA, CUANDO, INGRESO, SITUACION, TEMA, type Prioridad } from './agendar';
import type { Envio } from './correo';

export interface DatosAgendar {
  nombre: string;
  correo: string;
  whatsapp: string;
  tema: keyof typeof TEMA;
  situacion: keyof typeof SITUACION;
  ingreso: keyof typeof INGRESO;
  busca: keyof typeof BUSCA;
  cuando: keyof typeof CUANDO;
  caso: string;
  origen: string;
}

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string);

export function correoAgendar(d: DatosAgendar, prioridad: Prioridad): Envio {
  const filas: Array<[string, string]> = [
    ['Nombre', d.nombre],
    ['Correo', d.correo],
    ['WhatsApp', d.whatsapp],
    ['Tema', TEMA[d.tema]],
    ['Situación', SITUACION[d.situacion]],
    ['Ingreso', INGRESO[d.ingreso]],
    ['Busca', BUSCA[d.busca]],
    ['Cuándo', CUANDO[d.cuando]],
    ['Su caso', d.caso],
    ['Llegó de', d.origen],
  ];
  const marca = prioridad === 'alta' ? '[Prioridad] ' : '';
  const asunto = `${marca}Consulta 1:1: ${d.nombre} (${TEMA[d.tema]})`;
  const siguiente =
    'Siguiente paso: ya tiene el enlace para reservar y pagar. Si en 24 horas no aparece la cita en el calendario, escribirle por WhatsApp.';

  const texto = [...filas.map(([k, v]) => `${k}: ${v}`), '', siguiente].join('\n');
  const html = `<div style="font-family:system-ui,sans-serif;color:#3B2418;max-width:620px">
  <p style="margin:0 0 6px;font-size:13px;letter-spacing:.1em;text-transform:uppercase;color:#B0005F;font-weight:700">Cuentas Claras · /agendar${prioridad === 'alta' ? ' · prioridad' : ''}</p>
  <h1 style="margin:0 0 16px;font-size:22px">${esc(d.nombre)} pasó la precalificación</h1>
  <table style="border-collapse:collapse;width:100%;font-size:15px">
    ${filas
      .map(
        ([k, v]) =>
          `<tr><th style="text-align:left;vertical-align:top;padding:8px 12px 8px 0;border-bottom:1px solid #eee;width:110px">${esc(k)}</th><td style="padding:8px 0;border-bottom:1px solid #eee;white-space:pre-wrap">${esc(v)}</td></tr>`,
      )
      .join('\n    ')}
  </table>
  <p style="margin:16px 0 0;font-size:13px;color:#6b5a50">${esc(siguiente)}</p>
</div>`;

  // Sin responderA: el asunto trae la prioridad interna, y un "Responder" se la mandaría al prospecto
  return { asunto, html, texto };
}
