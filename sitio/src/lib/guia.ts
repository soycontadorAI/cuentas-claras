/**
 * "La hoja del año": lo que el sitio muestra de la guía. El texto completo de la guía (con sus
 * fundamentos) vive en cuentas-claras/docs/guia-hoja-del-anio.md; si cambia allá, se cambia aquí.
 *
 * Sin año en nada: la guía sirve cualquier ejercicio. Los límites se dicen "según la UMA vigente".
 */

export interface Mes {
  corto: string;
  largo: string;
  /** Lo que toca, en una línea (la vista previa de la hoja). */
  toca: string;
  /** Los meses que no se mueven van encerrados en rosa. */
  clave?: boolean;
  /** Una casilla del checklist, para la vista previa. */
  si?: string;
}

export const MESES: Mes[] = [
  { corto: 'Ene', largo: 'Enero', toca: 'Haz la cuenta: ¿te toca presentar?', si: 'Si tuviste dos patrones: sí' },
  { corto: 'Feb', largo: 'Febrero', toca: 'Llegan tus constancias', clave: true, si: 'Si tienes inversiones: pídelas' },
  { corto: 'Mar', largo: 'Marzo', toca: 'Revisa tus facturas en el portal' },
  { corto: 'Abr', largo: 'Abril', toca: 'Tu anual: vence el 30', clave: true, si: 'Si estás obligado: presenta' },
  { corto: 'May', largo: 'Mayo', toca: 'Sigue tu saldo a favor' },
  { corto: 'Jun', largo: 'Junio', toca: 'Revisa tu 32-D' },
  { corto: 'Jul', largo: 'Julio', toca: 'Abre tu buzón tributario' },
  { corto: 'Ago', largo: 'Agosto', toca: '¿Cobras por tu cuenta? Alta' },
  { corto: 'Sep', largo: 'Septiembre', toca: 'Paquete Económico' },
  { corto: 'Oct', largo: 'Octubre', toca: 'Revisa tu e.firma' },
  { corto: 'Nov', largo: 'Noviembre', toca: 'Planea tu aguinaldo', clave: true, si: 'Si tienes deudas: van primero' },
  { corto: 'Dic', largo: 'Diciembre', toca: 'Pide facturas y paga antes del 31', clave: true, si: 'Si deduces: ¿bien requisitadas?' },
];

export interface Pregunta {
  pregunta: string;
  /** La respuesta corta del sitio. La larga, con fundamento, está en la guía. */
  respuesta: string;
}

/** Las cinco preguntas de la parte 1 de la guía. También alimentan el JSON-LD FAQPage. */
export const PREGUNTAS: Pregunta[] = [
  {
    pregunta: '¿Por qué pagamos impuestos?',
    respuesta:
      'Porque así se paga lo que es de todos: escuelas, hospitales, carreteras. La Constitución dice que contribuimos de forma proporcional: quien gana más, paga más. Por eso el ISR sube por escalones, y la parte de tu ingreso que pasa de cierto nivel paga una tasa más alta.',
  },
  {
    pregunta: '¿Por qué me retienen si no le debo nada a nadie?',
    respuesta:
      'Retener es cobrar por adelantado a nombre del SAT. Tu patrón, tu banco o la empresa a la que le cobras separan una parte y se la mandan al SAT por ti. No es un impuesto extra: es un anticipo, y en tu declaración anual se resta de lo que te toca.',
  },
  {
    pregunta: '¿Por qué hay gastos que no puedo pagar en efectivo?',
    respuesta:
      'Porque el SAT necesita poder seguir el dinero. Tus deducciones personales (doctor, dentista, hospital, entre otras) solo cuentan si las pagas con tarjeta, transferencia o cheque nominativo. Pagadas en efectivo, la factura no te sirve aunque la tengas.',
  },
  {
    pregunta: '¿Qué pasa si tenía que presentar una declaración y no lo hice?',
    respuesta:
      'Puede haber multa por cada declaración, recargos si había impuesto a pagar y tu opinión de cumplimiento en negativo. Y si te tocaba saldo a favor, sin la declaración ese dinero se queda en el SAT. Si te pones al corriente antes de que el SAT te lo pida, por lo general no hay multa.',
  },
  {
    pregunta: 'Si mi compañero gana lo mismo que yo, ¿por qué a él le devuelven y a mí no?',
    respuesta:
      'Casi nunca es trampa. Lo más común es que él pidió factura de sus gastos médicos, los pagó con tarjeta y los dedujo. Otras razones: tener dos patrones en el año, otros ingresos como intereses, o dejar el trabajo antes de diciembre.',
  },
];

/** Lo que trae la guía, en tres renglones (sección #guia de la portada). */
export const TRAE = [
  {
    titulo: 'Los impuestos sin rodeos',
    texto:
      'Por qué pagamos, por qué te retienen, por qué no en efectivo, qué pasa si no presentas y por qué a tu compañero sí le devuelven.',
  },
  { titulo: 'El calendario de 12 meses', texto: 'Lo que toca cada mes y las fechas que no se mueven.' },
  { titulo: 'El checklist para palomear', texto: '“Si tienes inversiones, pide tus constancias.” Mes por mes.' },
];
