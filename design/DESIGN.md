# Cuentas Claras · identidad v2

**Vigente desde el 2026-10-24.** Tablero: `tableros/identidad-v2.html`.

La v2 es la dirección C (cacao, crema, maíz y rosa; Bricolage y Shrikhand) **con el volumen
ajustado**. En la v1, el rosa y el maíz de fondo hicieron que la identidad se leyera "a chisme".
El problema eran los fondos, no los colores. Ahora el fondo es siempre la libreta, y el rosa y el
maíz quedan como acentos.

## Historia (para no repetirla)

| Paso | Qué pasó |
|---|---|
| Tres direcciones (A Acuse, B Señalética, C Amistades largas) | `PROPUESTAS.md`, `tableros/index.html` |
| v1: C con la disciplina de B, rosa de fondo | `tableros/identidad.html`, exportes en `salidas/v1/`. Se leyó "a chisme" |
| Exploración de Acuse en cuatro pieles | `tableros/exploracion-acuse.html`. Se descartó: Israel prefirió los colores y la tipografía de C |
| Símbolo: cuatro opciones sin letras | `tableros/logo-exploracion.html`. Ganó el billete palomeado (Israel) |
| Qué va detrás del recorte en las miniaturas | `tableros/exploracion-recorte.html`. Ganó la 1: nada, el recorte con sombra (Israel). El círculo rosa se descartó |
| El texto del banner | `tableros/exploracion-banner.html`. Ganó la 5: la frase con los temas arriba (Israel) |

## El símbolo: billete palomeado

Un billete con la palomita en el medallón: "tu dinero, en orden". **No lleva letras**, así que
sobrevive si el nombre cambia. El "CC" se descartó por dos razones: se confunde con "Chisme
Corporativo" y depende del nombre, que puede estar registrado en el IMPI.

| Archivo | Uso |
|---|---|
| `simbolo.svg` | Versión clara: cacao, crema y el medallón rosa |
| `simbolo-oscuro.svg` | Versión oscura: crema sobre cacao, medallón maíz. Es la del ícono del canal |
| `salidas/avatar.png` | Ícono del canal, 800 × 800, en claro como el banner (libreta y billete). Era oscuro hasta el 2026-10-26; Israel lo quiso del mismo tono que el banner |
| `salidas/banner.png` | Banner del canal, 2560 × 1440, listo para subir |

**Logotipo** = símbolo + nombre rotulado en Shrikhand cacao, en dos renglones (`.lockup` en
`componentes.css`). Si el nombre cambia, solo cambia el texto; el símbolo se queda.

## Paleta y su volumen

| Token | Hex | Dónde va | Dónde NO va |
|---|---|---|---|
| `--crema` + cuadrícula | `#FFF6E8` | **El fondo de todo** (la libreta) | |
| `--cacao` | `#3B2418` | Texto, el símbolo, el ícono oscuro, los pasos | |
| `--rosa` | `#E4007C` | Acento: el remate rotulado, la raya del total, el paso actual, el medallón del símbolo | **Nunca de fondo** |
| `--maiz` | `#F6C343` | Dosis chicas: la estampa del año, el resaltado del subtítulo, el medallón en oscuro | **Nunca de fondo** |
| `--rosa-hondo` | `#B0005F` | Reserva para texto chico sobre rosa | |

Excepción ya aprobada: el **Short** conserva el título en placa rosa (Israel lo aprobó así). Va
sobre video, no sobre una miniatura, y es un solo bloque.

### Contraste (medido)

| Par | Contraste | Uso permitido |
|---|---|---|
| Cacao sobre crema | 13.5:1 | Todo |
| Cacao sobre maíz | 8.82:1 | Todo |
| Crema sobre rosa hondo | 6.51:1 | Todo, incluido texto chico |
| Crema sobre rosa / rosa sobre crema | 4.27:1 | Solo títulos, rotulado y texto grande |
| Maíz sobre rosa / rosa sobre maíz | 2.79:1 | Nunca texto |

## Tipografía

- **Bricolage Grotesque** (OFL): títulos a 800 y ancho 92 (a 78 se apelmaza), texto a 500-600.
- **Shrikhand** (OFL): el nombre en el logotipo y **un** remate por pieza. Nunca el título, nunca
  dos, nunca un párrafo.

## Las tres plantillas de miniatura

Las tres van sobre la libreta. Las distingue lo que llevan encima, no el fondo.

| Plantilla | Lleva | Ejemplos |
|---|---|---|
| **Trámite** | Título cacao, pasos (el actual en rosa), el año en estampa maíz | SIPARE, e.firma, CSF, RFC |
| **Error** | Título cacao, la captura real del portal, "así se arregla" rotulado con la raya | "No tiene privilegios", rechazos |
| **Dinero** | Título cacao, hasta tres renglones con puntos guía, el total rotulado en rosa | Aguinaldo, saldo a favor, RESICO |

**Detrás del recorte: nada.** La foto va directo sobre la libreta con una sombra suave
(`.recorte` en `componentes.css`). El círculo rosa de la v1 se descartó (Israel, 2026-10-24), y el
rosa no se usa para separar la foto del fondo.

## Reglas de cada miniatura

1. Título de **cuatro palabras o menos**, lo más grande que quepa.
2. **Pasa la prueba de 168 px o no sale** (la lista del teléfono, simulada en los tableros).
3. Israel en el tercio derecho; **la esquina inferior derecha, libre** (ahí va la duración).
4. **Nada que parezca oficial:** ni guinda, ni dorado, ni logos del SAT o del IMSS. La captura
   del portal va tal cual.

## Short y rótulo inferior

- **Short:** título en placa rosa con el tema rotulado encima, pasos en columna a la izquierda,
  subtítulo en píldora crema con la palabra clave en maíz. Libres la columna derecha (170 px) y
  los 380 px de abajo.
- **Rótulo:** píldora crema con el símbolo en un círculo cacao, el nombre en Bricolage 800 con la
  raya en rosa y, debajo, "Contador público · S & I Castro Consultores".

## Piezas para el video

| Pieza | Archivo | Cómo se usa |
|---|---|---|
| **Pantalla final** | `salidas/pantalla-final.png` (1920 × 1080) | Los últimos 20 segundos de cada video. La libreta, el logotipo chico, "Sigue con este" y "suscríbete" rotulado; Israel señala hacia el botón. En YouTube Studio se acomodan encima el video sugerido (izquierda, el recuadro grande) y el botón de suscribirse (círculo junto a la mano). Las guías de dónde va cada uno se ven en el tablero y no salen en el PNG |
| **Tarjeta "déjalo en nuestras manos"** | `salidas/tarjeta-en-nuestras-manos.png` (1920 × 1080, fondo transparente) | Se enciman en la edición cuando el trámite se complica: "¿No te salió? Déjalo en nuestras manos · El enlace está en la descripción". **Sin precio.** Usa el lugar del rótulo del nombre (abajo a la izquierda); nunca salen al mismo tiempo. Las tarjetas de YouTube no sirven para esto: los enlaces externos ahí piden el Programa de Socios |
| **Marca de agua** | `salidas/marca-de-agua.png` (150 × 150, transparente) | En Studio: Personalización, Imagen de marca, Marca de agua del video. El ícono del canal en chico: el círculo cacao con el billete en maíz |

## Banner

La libreta, el logotipo y una frase en la caja segura (1546 × 423). **"Hazlo tú, o déjalo en nuestras manos"
y "Un canal de S & I Castro Consultores" NO van en la imagen** (decisión de Israel, 2026-10-24):
van en la descripción del canal y en la de cada video. El dicho de la v1 se quitó porque
dependía del nombre. La frase:

> IMPUESTOS · CONTABILIDAD · FINANZAS PERSONALES (etiqueta chica, `.kicker`)
> El SAT y tu dinero,
> **en orden.** (rosa, con la raya del total)

El IMSS salió de la frase el 2026-10-26: el canal ya no es de seguridad social (ver "El giro" en
`../docs/estrategia.md`). La etiqueta suma Contabilidad, que es el puente entre SAT y finanzas.

## Exportar una pieza

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --hide-scrollbars \
  --virtual-time-budget=8000 --window-size=2560,1440 \
  --screenshot=design/salidas/banner.png "file://$PWD/design/tableros/identidad-v2.html#solo=t-banner"
```

La ventana va al tamaño nativo de la pieza (`t-avatar` 800 × 800, miniaturas 1280 × 720, Short
1080 × 1920). `?principal=RRGGBB` en la URL cambia el rosa para probar otro color sin tocar
`tokens.css`.

## Pendiente

- Revisar en el IMPI la marca "Cuentas Claras" (clases 41, 35 y 36).
- Un generador de miniaturas por plantilla (título, renglones y foto como datos).
