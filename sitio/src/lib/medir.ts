/**
 * Medición del lado del cliente. Adaptado de soycontador-ai/src/lib/medir.ts.
 *
 * Una sola puerta para todos los eventos. Cada llamada es inofensiva cuando no hay nada
 * escuchando: sin IDs en MEDICION (lib/sitio.ts), en local, en los previews o con un bloqueador,
 * window.gtag y window.fbq no existen y aquí no pasa nada.
 *
 * NUNCA se manda un dato personal: ni nombre, ni correo, ni WhatsApp, ni RFC, ni lo que la
 * persona escribió de su caso. Solo la categoría de lo que pasó (qué paso, qué salida, a qué
 * destino). Eso es lo que hace que la medición no cambie de naturaleza lo que la persona nos
 * confió en el formulario.
 */
type Datos = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

const limpiar = (datos: Datos): Datos => {
  // Se quitan los vacíos: GA manda undefined como la cadena "undefined".
  const limpio: Datos = {};
  for (const [k, v] of Object.entries(datos)) if (v !== undefined && v !== '') limpio[k] = v;
  return limpio;
};

/** Evento de GA4. */
export function medir(evento: string, datos: Datos = {}): void {
  window.gtag?.('event', evento, limpiar(datos));
}

/**
 * Un ID por evento del pixel: la llave con la que Meta deduplica si el mismo evento llega por el
 * navegador y por la API de conversiones. `randomUUID` solo existe en contexto seguro; el
 * respaldo no es criptográfico, pero para deduplicar basta con que no se repita. El PageView de
 * Analytics.astro usa la misma receta escrita a mano (es is:inline y no puede importar).
 */
export function nuevoEventId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}

/** Los eventos estándar de Meta que usa el sitio. No se inventan eventos propios. */
export type EventoMeta = 'Lead' | 'Schedule' | 'Contact';

/**
 * Evento estándar del pixel de Meta. Mismas reglas que `medir`, y además solo parámetros
 * estándar (`content_name`): el despacho es de servicios financieros y Meta descarta los
 * personalizados en esa categoría. La coincidencia avanzada automática va APAGADA en el panel.
 * Devuelve el `eventID`, para mandar el mismo evento desde el servidor el día que haya API de
 * conversiones.
 */
export function medirMeta(evento: EventoMeta, datos: Datos = {}): string {
  const eventID = nuevoEventId();
  window.fbq?.('track', evento, limpiar(datos), { eventID });
  return eventID;
}

/** Si el pixel está montado (para decidir si vale la pena esperar antes de navegar). */
export const hayPixel = (): boolean => typeof window.fbq === 'function';
