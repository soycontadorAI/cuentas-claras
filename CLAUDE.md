# Cuentas Claras

Canal de YouTube del despacho S & I Castro Consultores (`youtube.com/@cuentasclaras_mx`, con guion
bajo; antes `@todoconta`), patrocinado por TodoConta. +4,000 suscriptores, 96% llega por búsqueda y no vuelve.
El repo es estrategia, copy e identidad visual, y desde el 2026-10-26 también el sitio (`sitio/`,
Astro, para `cc.sicastro.com`). Repo: github.com/soycontadorAI/cuentas-claras (privado); Vercel
con *Root Directory* `sitio`.

## Dónde está cada cosa

| Archivo | Qué decide |
|---|---|
| `docs/estrategia.md` | El giro del 2026-10-26, avatar, datos de Studio, pilares, formato de series, la escalera de venta y la serie 1. **Estado: propuesta, falta el visto bueno de Israel** |
| `docs/series.md` | Banco de 10 series con calendario por temporada (nov 2026 a dic 2027) y la reforma fiscal 2027 |
| `docs/paquetes.md` | Solo referencia: qué paquete se ofrece en cada serie. Los paquetes y montos viven en `sicastro-v2/docs/paquetes.md` y `src/lib/honorarios.ts` |
| `docs/descripciones.md` | Descripción del canal, plantilla por video, comentario fijado, ejemplo de la serie 1. Borrador |
| `design/DESIGN.md` | **La identidad vigente (v2)** y su historia. Leerlo antes de tocar cualquier pieza visual |
| `design/PROPUESTAS.md` | Registro cerrado de las tres direcciones (A Acuse, B Señalética, C Amistades largas) |
| `design/tokens.css`, `design/componentes.css` | Paleta y componentes (`.lockup`, `.recorte`, `.kicker`) que usan los tableros |
| `design/tableros/*.html` | Tableros; `identidad-v2.html` es el vigente, los demás son registro |
| `design/salidas/` | PNG exportados con Chrome sin interfaz (comando en `README.md` y `DESIGN.md`) |
| `design/assets/` | Recortes de Israel (webp) para miniaturas |
| `design/landing/` | Bocetos de la landing (2026-10-26). **Elegido: A, libreta viva** (artifact https://claude.ai/artifact/AFnc6JVxVsnX9rWCgqSeYk), con dos cosas de los otros: la calculadora de deducciones de C y los billetes de B, que solo salen al suscribirse (nunca siguiendo al cursor). B y C quedan de registro. Ya construido en `sitio/` |
| `sitio/` | El sitio en Astro (`cc.sicastro.com`): portada, `/agendar` (precalificación), `/privacidad`, `/sistema` (design system vivo), `llms.txt`. Leer `sitio/README.md` (publicación) y `sitio/DESIGN-SYSTEM.md` |
| `docs/agendar-calendario.md` | Cómo configurar la agenda de Google Calendar con cobro por Stripe para la consulta 1:1 |
| `design/historias/` | Instagram de @soyisraelcastro: `generar.py` arma `tableros/historias.html` (foto de perfil con sombra maíz o rosa, 5 portadas de destacados y sus historias) y `exportar.sh` saca los PNG a `salidas/historias/` |
| `docs/instagram-destacadas-guiones.md` | Guiones en video de los destacados (Quién soy a cámara; Servicios, Preguntas y Agenda como consulta). Teleprompter en `social-studio/decks/2026-10-26-destacados-cuentas-claras.json`. Las láminas quedan de respaldo |
| `docs/guia-hoja-del-anio.md` | Contenido de la guía gratis "La guía" (en IG: "Guía gratis para no fallar con el SAT"): cinco preguntas, calendario de 12 meses, checklist "si tienes X, haz Y" y el cierre a la consulta (sin montos). Aprobado el 2026-10-27; el PDF sale con `design/guia/generar.py` |

## Lo que no se re-discute

- **El canal es del SAT y de tu dinero** (giro del 2026-10-26): trámites del SAT, la declaración,
  defensa básica ante el SAT y finanzas personales por la puerta fiscal; en medio, contabilidad y
  estados financieros básicos. **El IMSS no es eje**: Israel no es especialista en seguridad
  social. Entra solo como serie ocasional (modalidad 10, luego modalidad 40), una o dos al año con
  meses de por medio, dicho de frente que es lo que estudió. Nada de nómina del patrón (SIPARE,
  SUA, IDSE) como contenido nuevo.
- **El avatar:** persona física de 25-44 que quiere su SAT y su dinero en orden: el asalariado con
  algo más (intereses, Sofipo, herencia), el que cobra por su cuenta y el dueño de negocio chico
  que quiere entender sus números. Compra por certeza, se queda por tranquilidad. La prueba: ¿lo
  ve el contador o su cliente? Si es el cliente, va aquí.
- **Se reorienta sin miedo:** 96% de espectadores nuevos y sin periodicidad previa, no hay
  comunidad que perder. Publicación semanal, un largo con su Short.
- **Formato: la consulta, una duda por serie.** Cada serie arranca de la duda dicha como la diría
  un cliente y lleva los videos que pida (casi siempre tres, no siempre: en el copy público se dice
  "una duda, una serie", nunca "tres videos"). Cada video funciona solo (título = lo que se
  teclea), todos en una lista, la pantalla final al siguiente. Entre series, sueltos de trámite o error del SAT.
- **Conversión en el mismo video:** "Aprende con nosotros, o déjalo en nuestras manos" (2026-10-27; antes "Hazlo tú", que invitaba a hacerlo solo; y antes "o te lo
  hacemos", cambiado el 2026-10-26) hacia `cc.sicastro.com/agendar`, con
  utm (`utm_campaign=cuentas-claras&utm_content=<ID>`). Escalera: gratis, trámite a precio fijo,
  consulta, Tu Declaración, Resuelta, Plan del año para el asalariado (noviembre, febrero y la
  anual; al asalariado no se le cobra mensualidad), acompañamiento con actividad e iguala.
  **Cuentas Claras no tiene precios propios:** los paquetes y montos viven en
  `sicastro-v2/docs/paquetes.md` y `sicastro-v2/src/lib/honorarios.ts`, la fuente única, y se
  publican en `sicastro.com/honorarios`. Aquí no se copia ningún monto, y en el canal nunca se
  dice un precio: solo el enlace para contratar o pedir información.
- **A quién se le vende:** asalariado de $33,000 al mes o más (desde $400,000 al año está
  obligado), ideal más de $50,000. No se compite por precio. Los ejemplos de los videos usan ese
  perfil. Se mide
  clics a `/agendar`, consultas pagadas, cuántas pasan a un paquete, y el % de
  recurrentes (hoy 3.7%); no vistas ni suscriptores.
- **Nunca se dice el precio** en video, descripción ni tarjeta. TodoConta entra como patrocinador
  y solo con lo gratis (calculadoras, CSF, 32-D); sus planes no son para este público.
- **No se hace:** Contpaq ni Java, tono de alarma, recomendar dónde invertir o qué Afore (actividad
  regulada; sí se explica cómo se gravan intereses e inversiones y qué está exento), "maximizar la
  pensión" (la pensión es gestión del trámite).
- **Banner:** "Impuestos · Contabilidad · Finanzas personales / El SAT y tu dinero, en orden."
  Sin IMSS.
- **Identidad v2 (2026-10-24):** fondo siempre la libreta crema; rosa `#E4007C` y maíz `#F6C343`
  solo de acento, **nunca de fondo** (excepción aprobada: la placa rosa del Short). Bricolage
  Grotesque + Shrikhand (un solo remate por pieza). Símbolo = billete palomeado, sin letras.
  Detrás del recorte de Israel: nada, solo sombra.
- **Separación de marcas:** no se comparte tipografía ni color con soycontador.ai, TodoConta ni
  sicastro.com. Nada que parezca oficial (ni guinda, ni dorado, ni logos del SAT/IMSS).
- **Sitio y redes (2026-10-26):** el sitio propio, cuando exista, es solo de presentación (qué es
  el canal, captura de correos a cambio de algo, colaboraciones); no vende, los servicios mandan a
  sicastro.com. No se abren redes nuevas: el contenido va en `@soyisraelcastro` (se probó
  `@soyisca` y se regresó: es como se presenta, "Hola, soy Israel Castro") y las campañas pagadas en la página de Facebook del despacho
  (facebook.com/sicastroconsultores).
- **Sin año en los videos:** "depende de la UMA vigente", con la de ese año como ejemplo en
  pantalla. Así el video dura hasta que la ley cambie (ver "Reglas de guion" en `estrategia.md`).
- **Instagram (2026-10-26):** foto de perfil con sombra rosa; portadas de destacados todas en maíz
  (Instagram las reacomoda al editar una, así que no se alternan tonos).
- **Avatar en claro** (2026-10-26), del mismo tono que el banner: la libreta con el billete.
- **Las fotos de Israel se quedan** (2026-10-26): las mismas poses y la sudadera azul marino, recortadas
  sobre la libreta. Dan el "contador sin corbata"; no hace falta sesión nueva para la landing.
- **El sitio vive en `cc.sicastro.com`** (2026-10-26). `cuentasclaras.com` es dominio premium y no
  vale lo que cuesta; si algún día se muda, `cc.` redirige con 301. La guía se pide en
  `cc.sicastro.com` y la consulta en `cc.sicastro.com/agendar`.
- **`/agendar` filtra:** seis preguntas; el trámite suelto, la empresa, el "que me lo hagan" y el
  que casi seguro no está obligado salen a su puerta (honorarios, despacho, paquete o lo gratis).
  Quien pasa paga y escoge hora en la misma página de Google Calendar (Stripe). Sin precio en el
  sitio: liga a `sicastro.com/honorarios`.
- **Sendy:** brand propio "Cuentas Claras" (id 6, desde israel@sicastro.com). Las listas van ahí;
  la de prospectos ("diagnostico") es la del brand del despacho.
- **Las fichas "Qué hay aquí"** (sitio e historias): SAT; Tu declaración = obligación, deducciones
  y saldos a favor; Tus números = ingresos extra, finanzas sanas y estados financieros (no
  aguinaldo: no todos lo reciben).
- **La landing capta, no vende:** nombre y correo obligatorios, WhatsApp opcional, a cambio de "La
  guía" (se llamó "La hoja del año" hasta el 2026-10-27). El botón al despacho dice "Ir al despacho" y toda liga saliente lleva utm:
  `utm_source=cuentas-claras&utm_medium=landing|guia&utm_campaign=cuentas-claras&utm_content=<lugar>`.
- "Aprende con nosotros, o déjalo en nuestras manos" y "Un canal de S & I Castro Consultores" van en las descripciones,
  **no** en el banner ni en las miniaturas.

## Reglas de copy

Español de México, tuteo, sin raya larga (em-dash), comillas rectas en texto plano y curvas
(“ ”) en lo que se publica como imagen; nunca « ». Miniaturas: título de cuatro palabras o menos,
pasa la prueba de 168 px, esquina inferior derecha libre. Las cifras, tiempos y capítulos salen
del guion o de Studio, no de memoria.

## Pendiente (al 2026-10-26)

- Visto bueno de Israel a `docs/estrategia.md` y recorte de `docs/descripciones.md`.
- Visto bueno al acompañamiento ($2,500) en `sicastro-v2/docs/paquetes.md` (rama
  `feat/paquetes-honorarios`, sin commits). La iguala RESICO en $3,000 ya está aprobada.
- El embudo de la anual ya está en sicastro-v2 (`/declaracion-anual`), sin publicar. Pendientes
  (Sendy, Stripe, guía al día, audios por videos) en `sicastro-v2/docs/paquetes.md`.
- Subir el avatar nuevo (`design/salidas/avatar.png`, en claro).
- Elegir las series de `docs/series.md`. Lo de la reforma 2027 se verifica contra el DOF antes de
  grabar (al 2026-10-26 faltaba el pleno del Senado).
- Subir el banner nuevo (`design/salidas/banner.png`) a YouTube.
- Guion de la serie 1 ("Si solo tengo sueldo, ¿tengo que declarar?": obligación, deducciones
  personales, sueldo más intereses/Sofipo/herencia). Sale en noviembre.
- Publicar `sitio/` (Astro, `cc.sicastro.com`): repo, Vercel, CNAME, variables, listas de Sendy y
  la agenda de Google con cobro (`docs/agendar-calendario.md`). Checklist en `sitio/README.md`.
  Mientras no esté, el enlace de las descripciones apunta al WhatsApp del despacho.
- Confirmar en Studio si el canal es elegible para monetizar (horas de video largo, no Shorts).
- Revisar "Cuentas Claras" en el IMPI (clases 41, 35 y 36).
- Generador de miniaturas por plantilla (Trámite, Error, Dinero) con título, renglones y foto
  como datos.
- Las miniaturas de ejemplo del tablero `identidad-v2.html` todavía usan SIPARE; cambiarlas por
  temas del SAT cuando se haga el generador.

## Contexto fuera del repo

- Avatares de las otras marcas: `soycontador-ai/docs/avatar.md` y `arquitectura-de-marca.md`.
- Tarifa interna de trámites del despacho: `sicastro-v2/src/lib/honorarios.ts`.
- Decisión de julio de darle identidad propia al canal:
  `todoconta-apps/docs/lineamientos-marca-personal.md`.
