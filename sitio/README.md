# Sitio de Cuentas Claras (cc.sicastro.com)

Astro 7 estático con dos funciones en Vercel. Es el sitio de presentación del canal: capta
correos a cambio de "La guía" y precalifica la consulta 1:1. **No vende**: los servicios
y precios viven en sicastro.com (`/honorarios`), y aquí solo se enlazan con utm.

```sh
pnpm install
pnpm dev        # http://localhost:4321 (los formularios responden "simulado" sin .env)
pnpm check      # tipos
pnpm build      # .vercel/output
```

## Qué hay

| Ruta | Qué es |
|---|---|
| `/` | La portada (boceto A, "libreta viva"): qué hay en el canal, calculadora de deducciones, cinco preguntas, las series, la guía y quién está detrás |
| `/agendar` | Precalificación de la consulta 1:1 (seis pasos). Quien pasa recibe la página de citas de Google Calendar, que cobra con Stripe al reservar. Quien no, su salida: trámite, despacho, paquete o lo gratis |
| `/privacidad` | Aviso de privacidad |
| `/sistema` | El design system vivo (noindex, fuera del sitemap) |
| `/llms.txt`, `/llms-full.txt` | Para LLMs, con el patrón de soycontador-ai: salen de `src/lib`, no se escriben a mano |
| `/api/guia` | Alta en Sendy, lista "guia" (doble opt-in) |
| `/api/agendar` | Vuelve a correr la precalificación, avisa por SES y da de alta en la lista "diagnostico" |
| `/guia`, `/consulta` | Alias para decir en video (302) |

## Fuentes únicas

- `src/lib/sitio.ts`: nombre, URL, persona, despacho, canal, WhatsApp, `RESERVA_URL` (la página
  de citas) y `conUtm()`. Toda liga que sale lleva `utm_source=cuentas-claras&utm_medium=<landing|agendar|guia>&utm_campaign=cuentas-claras&utm_content=<lugar>`.
- `src/lib/guia.ts`: los meses y las cinco preguntas (también alimentan el JSON-LD FAQPage y
  `llms-full.txt`). El texto largo de la guía está en `../docs/guia-hoja-del-anio.md`.
- `src/lib/agendar.ts`: catálogos y la regla de la precalificación (`salida()`), compartida
  entre navegador y servidor.
- `src/styles/tokens.css`: el design system. Ver `DESIGN-SYSTEM.md`.

## Rendimiento (Lighthouse 100)

Medido el 2026-10-26 contra el deploy de Vercel (celular simulado): `/` y `/agendar` **100 en las
cuatro** (LCP 1.6 s y 1.3 s). En local con un servidor sin CDN la portada daba 99.

Lo que lo sostiene, no romperlo:
- **Cero JavaScript de terceros en el render** y cero librerías de animación: el movimiento es CSS
  más `src/scripts/movimiento.ts` (unos 1.4 KB). GA4 y el pixel se piden hasta después del `load`
  (ver "Medición").
- **Fuente propia recortada**: `src/assets/fuentes/bricolage-cc.woff2` (81 KB contra 131 KB del
  paquete), generada con `herramientas/fuente.sh`. Si el sitio usa un carácter nuevo fuera del
  español básico, se agrega ahí y se vuelve a correr.
- **Foto del hero en AVIF** con `<Picture>`, `fetchpriority="high"`.
- CSS incrustado (`inlineStylesheets: 'always'`).

## Medición (GA4 y pixel de Meta)

Lista, pero apagada: **los dos IDs van en `src/lib/sitio.ts`, constante `MEDICION`**
(`MEDICION.ga = 'G-XXXXXXXXXX'` y `MEDICION.metaPixel = '<ID del conjunto de datos>'`). Es el
único lugar; no son variables de entorno (un ID de medición viaja en el HTML, no es secreto). En
`null` no se carga ni se emite nada. Aun con IDs, solo cargan en el despliegue de producción
(`VERCEL_ENV === 'production'`): nunca en local ni en los previews. Patrón copiado de
soycontador-ai (`Analytics.astro`, `lib/medir.ts`, `lib/origen.ts`).

- `src/components/Analytics.astro` (montado en `Base.astro`): stubs de `gtag`/`fbq` en línea, las
  dos librerías hasta después del `load` en un momento ocioso, el origen de la visita y un escucha
  de clics delegado para las ligas salientes.
- `src/lib/medir.ts`: `medir()` (GA4) y `medirMeta()` (pixel, con `eventID` para deduplicar contra
  una futura API de conversiones). Las dos son inofensivas si el tag no está.
- `src/lib/origen.ts`: guarda en `sessionStorage` la primera página relevante de la sesión, el
  dominio de origen y los `utm_*`. `/sistema`, `/listo`, `/404` y `/api/*` no cuentan como
  aterrizaje.
- **Nunca un dato personal** (nombre, correo, WhatsApp, RFC, el texto del caso, las respuestas de
  la precalificación): solo categorías. Coincidencia avanzada automática del pixel **apagada** en
  el panel de Meta.

| Evento | Herramienta | Cuándo | Parámetros |
|---|---|---|---|
| `page_view` / `PageView` | GA4 / Meta | Cada página | (los de siempre; el PageView con `eventID`) |
| `guia_enviada` / `Lead` | GA4 / Meta | Alta exitosa a la guía (no si ya estaba en la lista) | `con_whatsapp` + origen / `content_name: guia` |
| `guia_confirmada` | GA4 | Llegada a `/listo` (Sendy regresa ahí al confirmar el correo) | origen |
| `agendar_paso` | GA4 | Cada paso de `/agendar` mostrado, una vez por visita | `paso` (1 a 6), `de` |
| `agendar_resultado` | GA4 | Sale la salida o pasa la precalificación | `resultado` (`pasa`/`salida`), `salida` (`tramite`, `empresa`, `paquete-anual`, `paquete-mes`, `no-obligado`, `sin-ingresos`) + origen |
| `agenda_abierta` / `Schedule` | GA4 / Meta | Clic a la agenda de Google Calendar | origen / `content_name: consulta` |
| `clic_saliente` / `Contact` | GA4 / Meta (solo WhatsApp) | Clic a sicastro.com, YouTube, WhatsApp, soycontador.ai, todoconta.com, Instagram o Facebook | `destino`, `pagina` (WhatsApp lleva además el origen) / `content_name: whatsapp` |

"Origen" son `origen_fuente` (utm_source, o el dominio de origen, o `directo`), `origen_medio`,
`origen_campana`, `origen_contenido`, `origen_referente`, `aterrizaje` y `pagina`. Para verlos como
columnas en GA4 hay que registrarlos como **dimensiones personalizadas de evento** (Administrar,
Definiciones personalizadas), igual que `destino`, `paso`, `resultado` y `salida`. Las historias
destacadas de Instagram enlazan con
`?utm_source=instagram&utm_medium=social&utm_campaign=destacado-<nombre>&utm_content=<id-de-la-story>`:
en los informes se ven por `origen_campana` y `origen_contenido` (y en la sesión, por la campaña
manual de GA4).

En Meta, Schedule y Contact detienen el clic 300 ms antes de navegar para que salga la petición
del pixel (las ligas abren en la misma pestaña).

**Cómo probar.** En producción: GA4, Administrar, DebugView con la extensión Google Analytics
Debugger; Meta, Administrador de eventos, Probar eventos, con la URL de `cc.sicastro.com`. Sin
tocar producción: `VERCEL_ENV=production pnpm build` con los IDs puestos y servir
`.vercel/output/static` en `localhost` (ahí GA4 va con `debug_mode` y aparece en DebugView). Los
previews de Vercel no cargan nada a propósito. Al activarla, volver a medir Lighthouse contra
producción.

## Antes de publicar

1. ~~Repo y proyecto~~: hecho el 2026-10-26. Repo `soycontadorAI/cuentas-claras` (privado), proyecto
   de Vercel `cuentas-claras` (*Root Directory* `sitio`, cada push a `main` despliega). Público en
   https://cuentas-claras-tau-three.vercel.app; la protección de Vercel queda solo en previews.
2. ~~Dominio~~: hecho el 2026-10-26. CNAME `cc` → `c871661ddde04ea7.vercel-dns-017.com` en
   Cloudflare, **nube gris**. El certificado no salió solo: se emitió con
   `vercel certs issue cc.sicastro.com --scope iscasurs-projects` (Let's Encrypt, se renueva solo).
3. **Variables** (ver `.env.example`): Sendy (API key, `SENDY_GUIA_LIST_ID`,
   `SENDY_DIAGNOSTICO_LIST_ID`) y SES (llave del usuario acotado del despacho, no una nueva: ver el
   inventario de IAM antes).
4. **Sendy**: brand "Cuentas Claras" (id 6) y su lista "La guía" (id 46, doble opt-in,
   conectada y probada el 2026-10-26; ver `../docs/sendy-guia.md`). Falta el autoresponder con el
   PDF y, en el brand del despacho, la lista de prospectos "diagnostico" (campos `Whatsapp`,
   `Regimen`, `Interes`, `RangoInterno`, `Origen`).
5. **Calendario con cobro**: seguir `../docs/agendar-calendario.md` y poner el enlace nuevo en
   `RESERVA_URL`.
6. **Aviso de privacidad**: confirmar domicilio y correo para derechos ARCO.
7. Search Console del subdominio y enviar `sitemap-index.xml`.
