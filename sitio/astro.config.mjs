// @ts-check
import { defineConfig, envField } from 'astro/config';

import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

// El sitio de Cuentas Claras vive en un subdominio del despacho (cc.sicastro.com). Si algún día
// se muda a un dominio propio, se cambia `site` y SITIO.url en src/lib/sitio.ts, y el dominio
// viejo redirige con 301.
export default defineConfig({
  site: 'https://cc.sicastro.com',
  output: 'static',
  adapter: vercel(),
  trailingSlash: 'never',
  integrations: [
    // /sistema es la hoja del design system: interna, fuera del sitemap y con noindex
    sitemap({ filter: (url) => !/\/(sistema|404|listo)$/.test(url) }),
  ],
  // El CSS va incrustado: con un solo archivo externo Lighthouse ya marca "render-blocking"
  build: { inlineStylesheets: 'always' },
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
  redirects: {
    // Alias que se dicen en video. 302 para poder repuntarlos sin pelear con la caché del navegador
    '/guia': { status: 302, destination: '/#guia' },
    '/consulta': { status: 302, destination: '/agendar' },
  },
  env: {
    schema: {
      // Sendy (sendy.todoconta.com). Una lista por promesa, porque el autoresponder se cuelga de la lista:
      //   guia        → "La hoja del año" (DOBLE opt-in; el autoresponder manda el PDF)
      //   diagnostico → la lista de prospectos del despacho, la misma que usa sicastro.com
      //                 (opt-in SENCILLO): ahí cae quien pasa la precalificación de /agendar
      SENDY_ACTION_URL: envField.string({ context: 'server', access: 'public', optional: true }),
      SENDY_API_KEY: envField.string({ context: 'server', access: 'secret', optional: true }),
      SENDY_GUIA_LIST_ID: envField.string({ context: 'server', access: 'public', optional: true }),
      SENDY_DIAGNOSTICO_LIST_ID: envField.string({ context: 'server', access: 'public', optional: true }),

      // Aviso interno de cada precalificación (SES us-east-1; sicastro.com ya tiene Easy DKIM,
      // así que el remitente es @sicastro.com aunque el sitio esté en cc.sicastro.com)
      SES_REGION: envField.string({ context: 'server', access: 'public', optional: true }),
      SES_ACCESS_KEY_ID: envField.string({ context: 'server', access: 'secret', optional: true }),
      SES_SECRET_ACCESS_KEY: envField.string({ context: 'server', access: 'secret', optional: true }),
      CORREO_REMITENTE: envField.string({ context: 'server', access: 'public', optional: true }),
      CORREO_DESPACHO: envField.string({ context: 'server', access: 'public', optional: true }),
    },
  },
});
