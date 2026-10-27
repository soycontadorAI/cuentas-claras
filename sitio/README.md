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
- **Cero JavaScript de terceros** y cero librerías de animación: el movimiento es CSS más
  `src/scripts/movimiento.ts` (unos 1.4 KB).
- **Fuente propia recortada**: `src/assets/fuentes/bricolage-cc.woff2` (81 KB contra 131 KB del
  paquete), generada con `herramientas/fuente.sh`. Si el sitio usa un carácter nuevo fuera del
  español básico, se agrega ahí y se vuelve a correr.
- **Foto del hero en AVIF** con `<Picture>`, `fetchpriority="high"`.
- CSS incrustado (`inlineStylesheets: 'always'`).

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
