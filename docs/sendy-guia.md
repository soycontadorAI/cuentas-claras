# Sendy: la lista de la guía

**Estado (2026-10-26):** hecho. Lista **id 46** en el brand "Cuentas Claras" (app 6), creada por
SQL con permiso de Israel copiando los ajustes de la lista 40 (respaldo de `lists` en
`/root/respaldos/` del VPS). ID cifrado `tC297632eLipw60cFSfC6tDQ`. Las tres variables ya están
en Vercel (producción) y el formulario se probó con un alta real. Falta el autoresponder con el
PDF (punto 2). Lo de abajo queda como referencia de cómo está configurada.

## 1. Crear la lista (sendy.todoconta.com → brand Cuentas Claras → View all lists → Add)

| Campo | Valor |
|---|---|
| List name | `Cuentas Claras - La guía` |
| Opt-in | **Double opt-in** |
| Subscribe success page | `https://cc.sicastro.com/listo` |
| Subscription confirmed page | `https://cc.sicastro.com/listo` |
| Custom fields (List settings → Custom fields) | `Whatsapp` (Text) y `Origen` (Text), con esa grafía exacta |

**Confirmation email** (List settings → Double opt-in confirmation email):

Asunto: `Confirma tu correo y te mando la guía`

```html
<p>Hola [Name,fallback=],</p>
<p>Pediste la guía de Cuentas Claras: qué hacer con el SAT, mes por mes.</p>
<p>Antes de mandártela, confirma que este correo es tuyo:</p>
<p><a href="[confirmation_link]" style="display:inline-block;padding:12px 22px;border-radius:999px;background:#3B2418;color:#FFF6E8;font-weight:bold;text-decoration:none;">Sí, mándame la guía</a></p>
<p>En cuanto le des clic, te llega en otro correo.</p>
<p>Si no la pediste tú, ignora este mensaje y no te volvemos a escribir.</p>
<p>Israel Castro<br>Contador público · Cuentas Claras</p>
```

## 2. El autoresponder (cuando esté el PDF)

Autoresponders → la lista → "Drip campaign", correo 1 **inmediato** con la guía adjunta. Hasta que
exista, quien confirme no recibe nada: no promover el formulario antes.

## 3. Conectar el sitio (Vercel, producción)

El ID de la lista es el que aparece en "View all lists" (la cadena cifrada, no el número). La API
key está en Settings de Sendy.

```sh
cd cuentas-claras/sitio
vercel env add SENDY_ACTION_URL production    # https://sendy.todoconta.com/subscribe
vercel env add SENDY_API_KEY production       # se pega sin mostrarla
vercel env add SENDY_GUIA_LIST_ID production  # el ID cifrado de la lista
vercel --prod                                 # o un push a main
```
