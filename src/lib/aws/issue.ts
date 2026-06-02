/**
 * End-to-end certificate issuance for one participant:
 *   generate PDF → upload to S3 → save DynamoDB record → email the link.
 *
 * Call this from an authenticated admin action, once per verified attendee.
 */

import { randomUUID } from "crypto";
import { assertConfigured } from "./env";
import { generateCertificatePdf } from "./pdf";
import { uploadCertificatePdf } from "./storage";
import { putCertificate } from "./repo";
import { sendCertificateEmail } from "./email";
import type { Certificate } from "./types";

export interface IssueInput {
  eventId: string;
  eventName: string;
  participantId: string;
  participantName: string;
  email: string;
  date: string;
  /** Skip the email (e.g. when re-generating a PDF). Defaults to false. */
  skipEmail?: boolean;
}

export async function issueCertificate(input: IssueInput): Promise<Certificate> {
  assertConfigured();

  const certId = randomUUID();
  const s3Key = `certs/${certId}.pdf`;

  const pdf = await generateCertificatePdf({
    participantName: input.participantName,
    eventName: input.eventName,
    date: input.date,
    certId,
  });
  await uploadCertificatePdf(s3Key, pdf);

  const cert: Certificate = {
    certId,
    eventId: input.eventId,
    eventName: input.eventName,
    participantId: input.participantId,
    participantName: input.participantName,
    issuedAt: new Date().toISOString(),
    s3Key,
    status: "issued",
  };
  await putCertificate(cert);

  if (!input.skipEmail) {
    await sendCertificateEmail({
      to: input.email,
      participantName: input.participantName,
      eventName: input.eventName,
      certId,
    });
  }

  return cert;
}
