/** Utilidades comunes de los endpoints. Port de sicastro-v2/src/lib/api.ts. */

import { DESPACHO } from './sitio';

export const json = (status: number, body: Record<string, unknown>): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  });

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const texto = (v: unknown, max: number): string => (typeof v === 'string' ? v.trim().slice(0, max) : '');

/** Lee el cuerpo JSON sin lanzar. */
export async function leerJson(request: Request): Promise<Record<string, unknown> | null> {
  try {
    const raw = await request.json();
    return raw && typeof raw === 'object' && !Array.isArray(raw) ? (raw as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

/** Cierre de los errores del lado nuestro: siempre con una salida humana. */
export const respaldo = `Inténtalo de nuevo en un momento o escríbenos por WhatsApp al ${DESPACHO.whatsappVisible}.`;

export const metodoNoPermitido = () => json(405, { ok: false, error: 'Método no permitido' });

/** WhatsApp mexicano: 10 dígitos, con o sin 52 / +52 / espacios. Devuelve los 10 o null. */
export function whatsappMx(v: string): string | null {
  const d = v.replace(/\D/g, '').replace(/^52(1)?(?=\d{10}$)/, '');
  return /^\d{10}$/.test(d) ? d : null;
}
