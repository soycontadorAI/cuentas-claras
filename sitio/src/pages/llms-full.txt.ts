/**
 * GET /llms-full.txt (se genera en build). El contenido de la portada en texto plano, para que un
 * LLM lo cite sin tener que ejecutar el sitio. Sale de las mismas fuentes que las páginas.
 */
import type { APIRoute } from 'astro';

import { BUSCA, TEMA } from '../lib/agendar';
import { MESES, PREGUNTAS, TRAE } from '../lib/guia';
import { CANAL, DESPACHO, PERSONA, PRECIO_CONSULTA_URL, SITIO } from '../lib/sitio';

export const GET: APIRoute = () => {
  const doc = `# ${SITIO.nombre}: ${SITIO.lema}

${SITIO.descripcion}

Canal: ${CANAL.url}
Conduce: ${PERSONA.nombre}, ${PERSONA.titulo.toLowerCase()}, socio de ${DESPACHO.nombre} (${DESPACHO.url}).

## Qué hay en el canal

- SAT: tus trámites sin perderte en el portal. RFC y e.firma, constancia de situación fiscal, buzón tributario y cartas.
- Tu declaración: la anual sin sorpresas. Obligación, deducciones personales y saldos a favor.
- Tus números: tu dinero en claro. Ingresos extra, finanzas sanas y estados financieros básicos.

## Cuánto te regresa una deducción

Cada peso que deduces te regresa lo que pagas de impuesto sobre ese peso, no el peso
completo: deducción × tu tasa marginal (tarifa anual del artículo 152 de la LISR).
Ejemplo: $20,000 de gastos médicos con tasa de 21.36% regresan alrededor de $4,272.
Las deducciones tienen topes y requisitos (artículo 151 de la LISR).

## Preguntas frecuentes

${PREGUNTAS.map((p) => `### ${p.pregunta}\n\n${p.respuesta}`).join('\n\n')}

## Guía gratis: qué hacer con el SAT, mes por mes

${TRAE.map((t) => `- ${t.titulo}: ${t.texto}`).join('\n')}

Calendario:

${MESES.map((m) => `- ${m.largo}: ${m.toca}${m.si ? ` (${m.si.toLowerCase()})` : ''}`).join('\n')}

Se pide en ${SITIO.url}/#guia con nombre y correo.

## Consulta 1:1

Media hora por videollamada, con una llamada de seguimiento. Primero una precalificación
en ${SITIO.url}/agendar. Es para estos temas: ${Object.values(TEMA).filter((t) => !/trámite|empresa|Otra/.test(t)).join('; ')}.
Lo que busca la consulta: ${BUSCA.entender.toLowerCase()}. Los trámites sueltos, las empresas y
quien quiere que se lo hagan van directo al despacho. Precio: ${PRECIO_CONSULTA_URL}.
`;
  return new Response(doc, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
