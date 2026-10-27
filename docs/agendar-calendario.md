# Consulta 1:1: Google Calendar con cobro por Stripe

**Fecha:** 2026-10-26 · **Estado:** por configurar (lo hace Israel desde su cuenta).

Cómo queda el flujo de `cc.sicastro.com/agendar`:

1. La persona contesta la precalificación (seis pasos). Si no le toca consulta, el sitio la
   manda a su salida y no deja datos.
2. Si pasa, el despacho recibe el aviso por correo y el sitio le muestra el botón "Escoger mi
   hora y pagar".
3. El botón abre la **página de citas de Google Calendar**, que cobra con Stripe **en el mismo
   paso**: el horario no se aparta hasta que se paga. No hace falta un checkout propio ni un
   segundo enlace "después de pagar".
4. ¿Transferencia? El mismo panel le da el WhatsApp con un mensaje ya escrito.

Por qué así y no Stripe Checkout + calendario aparte: con Google el pago y la cita son una sola
operación, así que no hay un enlace de calendario que se pueda compartir para reservar sin pagar,
ni una cita pagada sin hora.

## 1. Activar el cobro en Workspace (consola de administración)

Google: los cobros en citas son de pago y están en Business Standard, Business Plus, Enterprise,
Education y Workspace Individual. En Business Standard vienen **activados** por omisión; en los
demás, el administrador los activa.

1. admin.google.com → Aplicaciones → Google Workspace → Calendar → **Configuración avanzada**.
2. "Citas pagadas" (Paid appointments): activado para la unidad organizativa de Israel.

## 2. Conectar Stripe

1. En Stripe (cuenta de México, en pesos): que la cuenta esté verificada y con la cuenta bancaria
   de depósitos. Nombre en el estado de cuenta: algo como `SICASTRO CONSULTA`.
2. calendar.google.com → Configuración → General → **Agendas de citas** → **Conectar Stripe**.
3. Google cobra con tarjeta, Apple Pay y Google Pay. No hay OXXO ni SPEI por aquí: por eso está
   la puerta de transferencia por WhatsApp.

Ojo: Google no publica la lista de países. Si al conectar Stripe la opción no aparece para una
cuenta de México, el plan B es el checkout propio (ver al final).

## 3. La agenda de citas "Consulta 1:1"

Crear una nueva (calendar.google.com → Crear → Agenda de citas). Lo recomendado:

| Campo | Valor | Por qué |
|---|---|---|
| Título | Consulta 1:1 con Israel Castro | Es lo que ve la persona y lo que se manda a Stripe |
| Duración | 30 minutos | La consulta promedia 15 y se aparta media hora |
| Disponibilidad | Los bloques que Israel defina (p. ej. martes y jueves, 10:00 a 13:00 y 17:00 a 19:00) | Pocos bloques fijos, fáciles de proteger |
| Ventana de reserva | De 24 horas antes a 30 días | Da tiempo de leer el caso antes |
| Tiempo entre citas | 15 minutos | Para escribir los acuerdos |
| Máximo por día | 3 | Que no se coma el día |
| Revisar calendarios | El principal (y el del despacho si es otro) | Que no se empalme |
| Videollamada | Google Meet | El enlace sale solo en la invitación |
| Formulario de reserva | Nombre, correo (vienen fijos) + **WhatsApp** (obligatorio) + **"¿Qué quieres revisar?"** (obligatorio) + **"¿Necesitas factura? Escribe tu RFC"** (opcional) | El caso ya llegó por el sitio, pero así queda en la cita |
| Verificar correo | Activado | Evita reservas con correos inventados |
| Recordatorios | Correo 24 horas antes y 1 hora antes | |
| **Requerir pago** | Activado. Monto: **el de `PAQUETES.consulta` en `sicastro-v2/src/lib/honorarios.ts`**, en MXN | Una sola fuente: si cambia allá, se cambia aquí |
| Política de cancelación | Ver abajo | Google la muestra en la reserva y en los recordatorios |

**Política de cancelación (borrador para que Israel la ajuste):**

> Puedes reprogramar sin costo hasta 24 horas antes de tu cita. Si cancelas con más de 24 horas,
> te regresamos el pago completo. Con menos de 24 horas o si no te conectas, la consulta se da
> por tomada. Para reprogramar o cancelar, escríbenos por WhatsApp al 55 4475 3602.

Google no regresa dinero solo: los reembolsos se hacen desde el panel de Stripe.

## 4. Conectar con el sitio

Copiar el enlace de la agenda nueva ("Abrir página de reservas" → copiar) en `RESERVA_URL`
de `sitio/src/lib/sitio.ts`. Hoy apunta al enlace anterior
(`calendar.app.google/rQpRPJevZFjHT6WJ8`), que **no cobra**.

## Pendientes que tocan esto

- **IVA:** el monto que se pone en Google debe ser el precio final que paga la persona. Falta la
  respuesta de Israel: si los montos de `honorarios.ts` ya traen IVA y quién factura la consulta
  (la S.C. o Israel como persona física). Hasta entonces, no activar el cobro.
- **Factura:** Stripe no timbra. La factura se hace aparte con el RFC del formulario de reserva.
- **Comisión de Stripe:** revisar la tarifa vigente de Stripe México para tarjetas nacionales
  antes de fijar el precio.

## Plan B: checkout propio

Si Google no permite el cobro para la cuenta: `/api/agendar` crea una sesión de Stripe Checkout
(precio en una variable de entorno), la página de éxito verifica en el servidor que la sesión
esté pagada y solo entonces muestra el enlace de una agenda **sin** cobro. Es más código y deja
el enlace de la agenda expuesto a quien lo comparta; por eso es el plan B.

Fuentes: [Require payments for appointments](https://support.google.com/calendar/answer/13762729),
[Allow paid appointment schedules in Calendar](https://support.google.com/a/answer/13765946).
