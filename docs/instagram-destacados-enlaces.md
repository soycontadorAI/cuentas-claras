# Enlaces de los destacados de Instagram (@soyisraelcastro)

**Fecha:** 2026-10-27 · Los videos de cada historia están en
`hyperframes-30-days-cc/renders/destacados-cc/` (17 MP4, 1080 × 1920, −14 LUFS).

Cada historia con "Toca aquí" (o con el dedo señalando) lleva un **sticker de enlace** de Instagram.
El enlace va con utm para saber, en Google Analytics de cada sitio, qué historia trajo la visita.

## La convención

```
utm_source=instagram
utm_medium=social
utm_campaign=cuentas-claras-destacados
utm_content=<destacado>-<NN>        (el id de la historia: quien-03, servicios-02, …)
```

- `utm_campaign` es la misma para todos los destacados: en GA se filtra por campaña y se abre por
  `utm_content` para ver historia por historia.
- Lo que sale **desde el sitio** hacia otro lado sigue con su propia convención
  (`utm_source=cuentas-claras&utm_medium=landing|guia|agendar…`, ver `CLAUDE.md`). Esta es la de
  **Instagram hacia afuera**.
- El texto del sticker se puede cambiar en Instagram (al ponerlo, "Personalizar texto del sticker").
  Abajo va una sugerencia corta para cada uno.

## Los enlaces, historia por historia

### Quién soy

| Historia | Sticker | Enlace |
|---|---|---|
| 3/3 · Un video nuevo en Cuentas Claras | `Ver el canal` | `https://www.youtube.com/@cuentasclaras_mx?sub_confirmation=1` |

YouTube ignora los utm: la visita se ve en YouTube Studio → Alcance → Fuentes de tráfico →
"Externas" → Instagram. `sub_confirmation=1` abre de una vez la ventana de "Suscribirte".

### Servicios

| Historia | Sticker | Enlace |
|---|---|---|
| 2/4 · Lo del SAT, de principio a fin | `Ver precios` | `https://sicastro.com/honorarios?utm_source=instagram&utm_medium=social&utm_campaign=cuentas-claras-destacados&utm_content=servicios-02` |
| 3/4 · Enseño IA a contadores | `Aprende IA conmigo` | `https://soycontador.ai/?utm_source=instagram&utm_medium=social&utm_campaign=cuentas-claras-destacados&utm_content=servicios-03` |
| 4/4 · Menos portal. Más despacho. | `Probar TodoConta` | `https://todoconta.com/?utm_source=instagram&utm_medium=social&utm_campaign=cuentas-claras-destacados&utm_content=servicios-04` |

⚠️ **`sicastro.com/honorarios` da 404 hasta que se mergeen los PRs #1 y #2 de `soycontadorAI/sicastro`.**
El sticker ya va a la página definitiva (Israel, 2026-10-27): los montos se ajustan allá, no aquí.

### Preguntas

| Historia | Sticker | Enlace |
|---|---|---|
| 7/7 · Tu nombre, tu correo y listo (donde señala el dedo) | `La guía gratis` | `https://cc.sicastro.com/?utm_source=instagram&utm_medium=social&utm_campaign=cuentas-claras-destacados&utm_content=preguntas-07#guia` |

El `#guia` va al final (después de los utm) para que caiga directo en el formulario. No usar
`cc.sicastro.com/guia`: es una redirección y en el camino se pierden los utm.

### Agenda

| Historia | Sticker | Enlace |
|---|---|---|
| 2/3 · Tres pasos | `Agendar mi consulta` | `https://cc.sicastro.com/agendar?utm_source=instagram&utm_medium=social&utm_campaign=cuentas-claras-destacados&utm_content=agenda-02` |
| 3/3 · ¿Transferencia? Escríbeme por WhatsApp | `Escribir por WhatsApp` | `https://wa.me/525544753602?text=Hola%20Israel%2C%20vengo%20de%20tus%20historias%20de%20Instagram.%20Quiero%20pagar%20mi%20consulta%20por%20transferencia.` |

WhatsApp no lee utm: lo que identifica de dónde llegó es el mensaje ya escrito ("vengo de tus
historias de Instagram"). Si el WhatsApp que atiende prospectos cambia, se cambia aquí y en
`generar.py` (Agenda 3/3 lo dice en pantalla).

## El enlace de la bio

| Dónde | Enlace |
|---|---|
| Bio de @soyisraelcastro ("Guía gratis: qué hacer con el SAT cada mes 👇") | `https://cc.sicastro.com/?utm_source=instagram&utm_medium=social&utm_campaign=cuentas-claras-perfil&utm_content=bio#guia` |

Campaña distinta (`cuentas-claras-perfil`) para separar a quien llega por la bio de quien llega por
un destacado.

## Cómo se ve en Google Analytics

Cuando el sitio tenga GA4 (rama `medicion-ga4-meta`, en preparación): Informes → Adquisición →
Adquisición de tráfico, dimensión **Campaña de la sesión** = `cuentas-claras-destacados`, y como
dimensión secundaria **Contenido del anuncio manual** (`utm_content`). soycontador.ai y TodoConta ya
miden con GA4 y lo ven en su propia propiedad con la misma campaña.
