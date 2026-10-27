/**
 * JSON-LD. Todo sale de sitio.ts y guia.ts; las páginas componen su grafo con estos bloques.
 * Sin nodos Offer: Cuentas Claras no publica precios (viven en sicastro.com/honorarios).
 */

import { PREGUNTAS } from './guia';
import { CANAL, DESPACHO, PERSONA, SITIO } from './sitio';

type Nodo = Record<string, unknown>;

const ID = {
  sitio: `${SITIO.url}/#sitio`,
  persona: `${SITIO.url}/#israel-castro`,
  despacho: `${DESPACHO.url}/#despacho`,
  canal: `${SITIO.url}/#canal`,
};

export function sitioWeb(): Nodo {
  return {
    '@type': 'WebSite',
    '@id': ID.sitio,
    url: SITIO.url,
    name: SITIO.nombre,
    description: SITIO.descripcion,
    inLanguage: SITIO.lang,
    publisher: { '@id': ID.despacho },
  };
}

export function despacho(): Nodo {
  return {
    '@type': 'AccountingService',
    '@id': ID.despacho,
    name: DESPACHO.nombre,
    legalName: DESPACHO.razonSocial,
    url: DESPACHO.url,
    areaServed: { '@type': 'Country', name: 'México' },
    sameAs: [DESPACHO.facebook, CANAL.url],
    employee: { '@id': ID.persona },
  };
}

export function persona(): Nodo {
  return {
    '@type': 'Person',
    '@id': ID.persona,
    name: PERSONA.nombre,
    alternateName: PERSONA.nombreCompleto,
    jobTitle: PERSONA.titulo,
    image: `${SITIO.url}/israel-castro.jpg`,
    worksFor: { '@id': ID.despacho },
    sameAs: [...PERSONA.sameAs],
    knowsAbout: ['SAT', 'Declaración anual de personas físicas', 'Deducciones personales', 'ISR', 'RESICO', 'Finanzas personales'],
  };
}

export function canal(): Nodo {
  return {
    '@type': 'CreativeWorkSeries',
    '@id': ID.canal,
    name: CANAL.nombre,
    url: CANAL.url,
    inLanguage: SITIO.lang,
    author: { '@id': ID.persona },
    publisher: { '@id': ID.despacho },
    about: 'Trámites del SAT, la declaración anual y finanzas personales en México',
  };
}

export function preguntas(): Nodo {
  return {
    '@type': 'FAQPage',
    mainEntity: PREGUNTAS.map((p) => ({
      '@type': 'Question',
      name: p.pregunta,
      acceptedAnswer: { '@type': 'Answer', text: p.respuesta, author: { '@id': ID.persona } },
    })),
  };
}

export function consulta(): Nodo {
  return {
    '@type': 'Service',
    '@id': `${SITIO.url}/agendar#consulta`,
    name: 'Consulta 1:1 por videollamada',
    description:
      'Revisión de tu caso con el SAT (declaración anual, cartas, deducciones, ingresos extra) con un contador público, por videollamada. El precio está publicado en sicastro.com/honorarios.',
    provider: { '@id': ID.despacho },
    areaServed: { '@type': 'Country', name: 'México' },
    availableLanguage: 'es',
    url: `${SITIO.url}/agendar`,
  };
}
