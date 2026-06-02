/** Sends the "thanks for coming — here's your certificate" email via SES. */

import { SendEmailCommand } from "@aws-sdk/client-sesv2";
import { ses } from "./clients";
import { awsConfig } from "./env";

export interface CertEmailInput {
  to: string;
  participantName: string;
  eventName: string;
  certId: string;
}

export async function sendCertificateEmail(input: CertEmailInput): Promise<void> {
  const url = `${awsConfig.baseUrl}/cert/${input.certId}`;
  const firstName = input.participantName.split(" ")[0];

  await ses().send(
    new SendEmailCommand({
      FromEmailAddress: awsConfig.sesSender,
      Destination: { ToAddresses: [input.to] },
      Content: {
        Simple: {
          Subject: { Data: `Tu certificado — ${input.eventName}` },
          Body: {
            Html: {
              Data: `
                <div style="font-family:Arial,Helvetica,sans-serif;color:#0c1024;line-height:1.6">
                  <p>¡Gracias por venir a <b>${input.eventName}</b>, ${firstName}!</p>
                  <p>Aquí está tu certificado verificable:</p>
                  <p><a href="${url}" style="color:#06175d;font-weight:bold">${url}</a></p>
                  <p style="color:#5d6383;font-size:13px">AWS Student Builder Group · UPB Cochabamba</p>
                </div>`,
            },
            Text: {
              Data: `¡Gracias por venir a ${input.eventName}, ${firstName}! Tu certificado verificable: ${url}`,
            },
          },
        },
      },
    })
  );
}
