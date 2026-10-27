/**
 * Alta en Sendy desde el servidor (la API key nunca viaja al navegador).
 * Port de sicastro-v2/src/lib/sendy.ts (que a su vez es el de soycontador-ai).
 *
 * Una lista por promesa, sin caer de una a otra: el autoresponder se cuelga de la lista.
 *   guia        → "La guía" (DOBLE opt-in; el autoresponder manda el PDF)
 *   diagnostico → prospectos del despacho, la misma lista que usa sicastro.com (opt-in SENCILLO,
 *                 sin autoresponder): ahí cae quien pasa la precalificación de /agendar
 */

import {
  SENDY_ACTION_URL,
  SENDY_API_KEY,
  SENDY_DIAGNOSTICO_LIST_ID,
  SENDY_GUIA_LIST_ID,
} from 'astro:env/server';

/**
 * `invalido` separa "Sendy rechazó la dirección" de "algo se cayó": el primero no se arregla
 * reintentando, así que el formulario no debe responder "inténtalo de nuevo".
 */
export type EstadoSendy = 'confirm' | 'already' | 'invalido' | 'error';

export type Lista = 'guia' | 'diagnostico';

const LISTAS: Record<Lista, string | undefined> = {
  guia: SENDY_GUIA_LIST_ID,
  diagnostico: SENDY_DIAGNOSTICO_LIST_ID,
};
const idDeLista = (lista: Lista): string | undefined => LISTAS[lista];

export const sendyConfigurado = (lista: Lista): boolean =>
  Boolean(SENDY_API_KEY && SENDY_ACTION_URL && idDeLista(lista));

export interface SuscribirInput {
  email: string;
  nombre?: string;
  lista: Lista;
  /** Sendy rechaza el alta si no es URL válida: solo se manda cuando parsea */
  referrer?: string;
  /**
   * Campos personalizados con el nombre EXACTO del campo en la lista de Sendy. Sendy no se queja
   * de un campo que no reconoce: simplemente no lo guarda, y el dato se pierde sin que nada falle.
   */
  campos?: Record<string, string>;
}

export async function suscribir(input: SuscribirInput): Promise<EstadoSendy> {
  const list = idDeLista(input.lista);
  if (!SENDY_API_KEY || !SENDY_ACTION_URL || !list) {
    console.error(`[sendy] lista "${input.lista}" sin configurar (SENDY_API_KEY/ACTION_URL/LIST_ID)`);
    return 'error';
  }

  try {
    const body = new URLSearchParams({ api_key: SENDY_API_KEY, email: input.email, list, boolean: 'true' });
    if (input.nombre) body.set('name', input.nombre);
    if (input.referrer && URL.canParse(input.referrer)) body.set('referrer', input.referrer);
    for (const [campo, valor] of Object.entries(input.campos ?? {})) {
      if (valor) body.set(campo, valor.slice(0, 500));
    }

    const resp = await fetch(SENDY_ACTION_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
      signal: AbortSignal.timeout(8000),
    });
    const texto = (await resp.text()).trim();
    if (texto === '1' || texto === 'true') return 'confirm';
    if (texto === 'Already subscribed.') return 'already';
    if (/invalid email/i.test(texto)) return 'invalido';
    console.warn('[sendy] respondió: %s', texto.slice(0, 120));
    return 'error';
  } catch (err) {
    console.error('[sendy] no respondió:', err);
    return 'error';
  }
}
