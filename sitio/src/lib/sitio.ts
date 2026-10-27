/**
 * Fuente única de los datos del sitio: quién publica, a dónde se manda y con qué utm.
 * El JSON-LD, llms.txt, el pie y los formularios leen de aquí. No duplicar estos datos a mano.
 *
 * Cuentas Claras no tiene precios propios: los montos viven en sicastro-v2/src/lib/honorarios.ts
 * y se publican en sicastro.com/honorarios. Aquí solo se enlaza.
 */

export const SITIO = {
  nombre: 'Cuentas Claras',
  url: 'https://cc.sicastro.com',
  lema: 'El SAT y tu dinero, en orden.',
  descripcion:
    'Trámites del SAT paso a paso, tu declaración sin sorpresas y tus números claros. El canal de YouTube de S & I Castro Consultores, con Israel Castro, contador público.',
  locale: 'es_MX',
  lang: 'es-MX',
} as const;

export const PERSONA = {
  nombre: 'Israel Castro',
  nombreCompleto: 'Israel Castro Urieta',
  titulo: 'Contador público',
  instagram: 'https://www.instagram.com/soyisraelcastro/',
  handleInstagram: '@soyisraelcastro',
  /** Perfiles que confirman que es la misma persona (JSON-LD sameAs y llms.txt). */
  sameAs: [
    'https://www.youtube.com/@cuentasclaras_mx',
    'https://www.instagram.com/soyisraelcastro/',
    'https://soycontador.ai',
  ],
} as const;

export const DESPACHO = {
  nombre: 'S & I Castro Consultores',
  razonSocial: 'S I Castro Consultores, S.C.',
  url: 'https://sicastro.com',
  facebook: 'https://www.facebook.com/sicastroconsultores/',
  /** El WhatsApp del despacho (sicastro-v2/src/lib/site.ts). */
  whatsapp: '525544753602',
  whatsappVisible: '55 4475 3602',
} as const;

export const CANAL = {
  nombre: 'Cuentas Claras',
  url: 'https://www.youtube.com/@cuentasclaras_mx',
  handle: '@cuentasclaras_mx',
} as const;

/**
 * Página de citas de Google Calendar ("Consulta 1:1"), con el cobro por Stripe activado en la
 * misma página: el horario no se aparta hasta que se paga. Solo se muestra a quien pasa la
 * precalificación de /agendar. La configuración está en docs/agendar-calendario.md.
 *
 * PENDIENTE: es el enlace que ya existía. Cuando se cree la página nueva con cobro, se cambia aquí.
 */
export const RESERVA_URL = 'https://calendar.app.google/rQpRPJevZFjHT6WJ8';

/** Dónde se ve el precio de la consulta (la tabla de persona física de /honorarios). */
export const PRECIO_CONSULTA_URL = 'https://sicastro.com/honorarios#persona-fisica';

/**
 * Toda liga que sale del sitio lleva utm, con la convención del canal:
 * utm_source=cuentas-claras&utm_medium=<landing|guia|agendar>&utm_campaign=cuentas-claras&utm_content=<lugar>
 */
export function conUtm(url: string, medio: 'landing' | 'agendar' | 'guia', lugar: string): string {
  const u = new URL(url);
  u.searchParams.set('utm_source', 'cuentas-claras');
  u.searchParams.set('utm_medium', medio);
  u.searchParams.set('utm_campaign', 'cuentas-claras');
  u.searchParams.set('utm_content', lugar);
  return u.toString();
}

export const whatsappUrl = (texto?: string) =>
  `https://wa.me/${DESPACHO.whatsapp}${texto ? `?text=${encodeURIComponent(texto)}` : ''}`;
