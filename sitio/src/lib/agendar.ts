/**
 * Precalificación de /agendar. La usan el navegador (para mandar a cada quien a su salida en
 * cuanto contesta) y el endpoint (que la vuelve a correr: lo que llega del navegador no se cree).
 *
 * La regla: la consulta 1:1 es para quien tiene un caso que revisar con sus números y quiere
 * entenderlo. No es para un trámite suelto (eso tiene precio fijo), ni para una empresa (eso es
 * acompañamiento del despacho), ni para quien quiere que se lo hagan (eso es un paquete), ni para
 * quien casi seguro no está obligado (eso lo resuelve un video gratis).
 */

import { CANAL, DESPACHO, conUtm } from './sitio';

export const TEMA = {
  anual: 'Mi declaración anual',
  carta: 'Me llegó algo del SAT (carta, requerimiento, buzón)',
  corriente: 'Dejé de declarar y quiero ponerme al corriente',
  extra: 'Tengo sueldo y algo más (intereses, inversiones, renta, herencia)',
  negocio: 'Cobro por mi cuenta o tengo un negocio y quiero entender qué me toca',
  tramite: 'Necesito un trámite (RFC, e.firma, constancia, 32-D)',
  empresa: 'Tengo una empresa (persona moral)',
  otro: 'Otra cosa',
} as const;

export const SITUACION = {
  sueldo: 'Solo sueldo, de un patrón',
  'sueldo-mas': 'Sueldo y algo más, o dos patrones en el año',
  'cuenta-propia': 'Cobro por mi cuenta (honorarios, RESICO, actividad empresarial)',
  empresa: 'Soy socio o dueño de una empresa',
  'sin-ingresos': 'Por ahora no tengo ingresos',
} as const;

export const INGRESO = {
  '<20': 'Menos de $20,000 al mes',
  '20-33': 'De $20,000 a $33,000',
  '33-50': 'De $33,000 a $50,000',
  '50-100': 'De $50,000 a $100,000',
  '>100': 'Más de $100,000',
} as const;

export const BUSCA = {
  entender: 'Entender mi caso y saber qué hacer (lo hago yo)',
  hacerlo: 'Que me lo hagan',
  'no-se': 'No sé, primero quiero saber qué me toca',
} as const;

export const CUANDO = {
  fecha: 'Tengo una fecha límite o un requerimiento',
  pronto: 'En las próximas semanas',
  'sin-prisa': 'Sin prisa',
} as const;

export type Tema = keyof typeof TEMA;
export type Situacion = keyof typeof SITUACION;
export type Ingreso = keyof typeof INGRESO;
export type Busca = keyof typeof BUSCA;
export type Cuando = keyof typeof CUANDO;

export interface Respuestas {
  tema?: Tema;
  situacion?: Situacion;
  ingreso?: Ingreso;
  busca?: Busca;
  cuando?: Cuando;
}

export type Salida = 'tramite' | 'empresa' | 'paquete-anual' | 'paquete-mes' | 'no-obligado' | 'sin-ingresos';

/**
 * Devuelve la salida que le toca a estas respuestas, o null si pasa a la consulta.
 * Se puede llamar con respuestas incompletas: decide en cuanto tiene con qué.
 */
export function salida(r: Respuestas): Salida | null {
  if (r.tema === 'tramite') return 'tramite';
  if (r.tema === 'empresa' || r.situacion === 'empresa') return 'empresa';
  if (r.situacion === 'sin-ingresos' && r.tema !== 'carta' && r.tema !== 'corriente') return 'sin-ingresos';
  // Solo sueldo de un patrón y menos de $20,000: casi seguro no está obligado (el tope son
  // $400,000 al año) y lo resuelve el video gratis. Salvo que le haya llegado algo del SAT.
  if (r.situacion === 'sueldo' && r.ingreso === '<20' && (r.tema === 'anual' || r.tema === 'otro')) return 'no-obligado';
  if (r.busca === 'hacerlo') {
    if (r.tema === 'anual' || r.tema === 'extra') return 'paquete-anual';
    return 'paquete-mes';
  }
  return null;
}

export interface Destino {
  titulo: string;
  texto: string;
  boton: string;
  url: string;
  /** Una segunda puerta, más chica. */
  otra?: { texto: string; url: string };
}

const sicastro = (ruta: string, lugar: string) => conUtm(`${DESPACHO.url}${ruta}`, 'agendar', lugar);

export const DESTINOS: Record<Salida, Destino> = {
  tramite: {
    titulo: 'Eso no necesita consulta.',
    texto:
      'Los trámites tienen precio fijo en el despacho, y casi todos tienen su video paso a paso por si prefieres hacerlo tú.',
    boton: 'Ver trámites y precios',
    url: sicastro('/honorarios#tramites', 'salida-tramite'),
    otra: { texto: 'O aprende con nosotros en el canal', url: CANAL.url },
  },
  empresa: {
    titulo: 'Una empresa se ve con el despacho.',
    texto:
      'Lo de una persona moral no cabe en una consulta de media hora: se revisa con un diagnóstico y un acompañamiento a la medida.',
    boton: 'Ir al despacho',
    url: sicastro('/#diagnostico', 'salida-empresa'),
  },
  'paquete-anual': {
    titulo: 'Si quieres que te la hagamos, hay un paquete.',
    texto:
      'Para tu declaración anual no necesitas pagar una consulta y luego el trabajo: el paquete del despacho incluye revisarla contigo.',
    boton: 'Ver el paquete de la anual',
    url: sicastro('/declaracion-anual', 'salida-paquete-anual'),
  },
  'paquete-mes': {
    titulo: 'Eso es acompañamiento del despacho.',
    texto:
      'Si quieres que se encarguen de tus declaraciones o de ponerte al corriente, el despacho lo cotiza con un diagnóstico de dos minutos. Los precios están publicados.',
    boton: 'Ir al despacho',
    url: sicastro('/#diagnostico', 'salida-paquete-mes'),
    otra: { texto: 'Ver precios', url: sicastro('/honorarios', 'salida-paquete-mes') },
  },
  'no-obligado': {
    titulo: 'Lo más probable es que no estés obligado.',
    texto:
      'Si solo tuviste un patrón todo el año y ganas menos de $20,000 al mes, casi nunca te toca presentar. Ojo: si tienes deducciones, presentarla puede regresarte dinero. El video te dice cómo saberlo.',
    boton: 'Ver el video',
    url: CANAL.url,
    otra: { texto: 'O pide la guía gratis', url: '/#guia' },
  },
  'sin-ingresos': {
    titulo: 'Para empezar, lo gratis.',
    texto: 'Sin ingresos todavía, lo que necesitas está en los videos y en la guía gratis.',
    boton: 'Pedir la guía',
    url: '/#guia',
    otra: { texto: 'Ver el canal', url: CANAL.url },
  },
};

export type Prioridad = 'alta' | 'normal';

/** Para el correo interno: a quién contestar primero. */
export function prioridad(r: Respuestas): Prioridad {
  const ingresoAlto = r.ingreso === '33-50' || r.ingreso === '50-100' || r.ingreso === '>100';
  return r.cuando === 'fecha' || (ingresoAlto && r.cuando === 'pronto') ? 'alta' : 'normal';
}
