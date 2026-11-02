/**
 * Origen de la visita: cómo llegó una persona al sitio. Adaptado de soycontador-ai/src/lib/origen.ts.
 *
 * `capturarOrigen()` corre en cada página (lo monta Analytics.astro, y solo cuando hay un ID de
 * medición puesto) y guarda en sessionStorage SOLO la primera página relevante: la de aterrizaje,
 * de qué sitio venía y los utm_* del enlace. Las siguientes no la pisan: el dato que sirve es qué
 * la trajo, no por dónde navegó después. Los eventos importantes lo llevan como categorías
 * (`paraMedicion()`).
 *
 * El caso que lo pide: las historias destacadas de Instagram enlazan con
 * utm_source=instagram&utm_medium=social&utm_campaign=destacado-<nombre>&utm_content=<id-de-la-story>,
 * y así cada alta a la guía o cada clic a la agenda dice de qué historia salió.
 *
 * Páginas que no cuentan como aterrizaje: /sistema (interna), /listo (a donde regresa Sendy tras
 * confirmar el correo: no trae a nadie, solo cierra un alta), /404 y /api/*. Si la sesión empieza
 * ahí, no se guarda nada y la siguiente página es la que cuenta.
 *
 * Por qué sessionStorage y no una cookie ni localStorage: vive solo mientras dura la pestaña, no
 * viaja al servidor y no deja nada en el navegador de quien volvió otro día.
 *
 * Nada de esto es dato personal: rutas, el dominio de origen (sin ruta ni parámetros) y las
 * etiquetas que Israel mismo puso en sus enlaces. Todo va en try/catch porque sessionStorage
 * puede lanzar (modo privado, bloqueo de datos del sitio) y el sitio tiene que seguir igual.
 */

const CLAVE = 'cc_origen';
const UTM = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'] as const;
const SIN_ATERRIZAJE = /^\/(sistema|listo|404|api)(\/|$)/;

export interface Origen {
  /** Ruta de la primera página relevante de la sesión: "/agendar". */
  aterrizaje?: string;
  /** Dominio de donde venía, sin ruta: "instagram.com". Vacío si fue directo o interno. */
  referente?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
}

const recorta = (v: string | null | undefined, max = 80): string | undefined => {
  const t = (v ?? '').trim().slice(0, max);
  return t || undefined;
};

export function capturarOrigen(): void {
  try {
    if (sessionStorage.getItem(CLAVE)) return;
    if (SIN_ATERRIZAJE.test(location.pathname)) return;

    const origen: Origen = { aterrizaje: recorta(location.pathname, 120) };

    // Solo el dominio: la ruta y los parámetros del sitio de origen pueden traer cosas que no
    // son nuestras (búsquedas, tokens).
    if (document.referrer) {
      try {
        const ref = new URL(document.referrer);
        if (ref.hostname && ref.hostname !== location.hostname) {
          origen.referente = recorta(ref.hostname.replace(/^(www|m|l|lm)\./, ''));
        }
      } catch {
        /* referrer ilegible: se queda sin referente */
      }
    }

    const params = new URLSearchParams(location.search);
    for (const k of UTM) origen[k] = recorta(params.get(k));

    sessionStorage.setItem(CLAVE, JSON.stringify(origen));
  } catch {
    /* sin almacenamiento: el sitio funciona igual, solo sin este dato */
  }
}

export function leerOrigen(): Origen {
  try {
    return JSON.parse(sessionStorage.getItem(CLAVE) ?? '{}') as Origen;
  } catch {
    return {};
  }
}

/**
 * Las etiquetas de origen que viajan con los eventos de GA4. `fuente` es lo más específico que
 * haya: el utm_source del enlace, o el dominio de origen, o "directo". Para verlas como columnas
 * en los informes hay que registrarlas como dimensiones personalizadas (ver README, "Medición").
 */
export function paraMedicion(): Record<string, string | undefined> {
  const o = leerOrigen();
  return {
    origen_fuente: o.utm_source ?? o.referente ?? 'directo',
    origen_medio: o.utm_medium,
    origen_campana: o.utm_campaign,
    origen_contenido: o.utm_content,
    origen_referente: o.referente,
    aterrizaje: o.aterrizaje,
    pagina: location.pathname,
  };
}
