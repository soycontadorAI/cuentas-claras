/**
 * Envío por Amazon SES (us-east-1). Port de sicastro-v2/src/lib/correo.ts.
 *
 * sicastro.com (no cc.sicastro.com) ya es identidad de dominio en SES con Easy DKIM y MAIL FROM `ses.sicastro.com`,
 * así que el remitente TIENE que ser @sicastro.com; con cualquier otro, SES rechaza o el correo
 * no alinea DMARC.
 */

import { SendEmailCommand, SESv2Client } from '@aws-sdk/client-sesv2';
import {
  CORREO_DESPACHO,
  CORREO_REMITENTE,
  SES_ACCESS_KEY_ID,
  SES_REGION,
  SES_SECRET_ACCESS_KEY,
} from 'astro:env/server';

export const correoConfigurado = Boolean(
  SES_ACCESS_KEY_ID &&
    SES_SECRET_ACCESS_KEY &&
    SES_REGION &&
    CORREO_REMITENTE?.endsWith('@sicastro.com') &&
    CORREO_DESPACHO,
);

let cliente: SESv2Client | null = null;
function obtenerCliente(): SESv2Client {
  cliente ??= new SESv2Client({
    region: SES_REGION,
    credentials: { accessKeyId: SES_ACCESS_KEY_ID as string, secretAccessKey: SES_SECRET_ACCESS_KEY as string },
  });
  return cliente;
}

export interface Envio {
  asunto: string;
  html: string;
  texto: string;
  /** Por omisión, el buzón del despacho (CORREO_DESPACHO). */
  para?: string;
  /** A quién se responde con "Responder". Nunca al prospecto en un correo que trae el rango interno. */
  responderA?: string;
}

/**
 * Devuelve true si SES lo aceptó. Nunca lanza: quien llama decide qué hacer con un fallo, y en el
 * diagnóstico eso significa avisarle a la persona en lugar de fingir que se registró.
 */
export async function enviar(envio: Envio): Promise<boolean> {
  if (!correoConfigurado) {
    console.error('[correo] SES sin configurar: no se envió', envio.asunto);
    return false;
  }
  try {
    await obtenerCliente().send(
      new SendEmailCommand({
        FromEmailAddress: `Cuentas Claras · S & I Castro Consultores <${CORREO_REMITENTE}>`,
        Destination: { ToAddresses: [envio.para ?? (CORREO_DESPACHO as string)] },
        ReplyToAddresses: envio.responderA ? [envio.responderA] : undefined,
        Content: {
          Simple: {
            Subject: { Data: envio.asunto, Charset: 'UTF-8' },
            Body: {
              Html: { Data: envio.html, Charset: 'UTF-8' },
              Text: { Data: envio.texto, Charset: 'UTF-8' },
            },
          },
        },
      }),
    );
    return true;
  } catch (err) {
    console.error('[correo] SES rechazó el envío:', err);
    return false;
  }
}
