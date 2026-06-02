/**
 * Certificate PDF generation.
 *
 * Primary path: load the AWS-provided template from S3 and overlay the
 * participant name, event name, date and a verification QR code.
 *
 * Fallback: if no template has been uploaded yet, draw a simple branded
 * certificate from scratch so the flow is testable end-to-end.
 *
 * The text coordinates below are sensible defaults — tune them once you've
 * uploaded the real template (see docs/aws-certificates.md).
 */

import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import QRCode from "qrcode";
import { awsConfig } from "./env";
import { fetchTemplate } from "./storage";

export interface CertFields {
  participantName: string;
  eventName: string;
  date: string;
  certId: string;
}

const NAVY = rgb(0.024, 0.09, 0.365); // #06175D
const INK = rgb(0.4, 0.4, 0.45);

export async function generateCertificatePdf(
  fields: CertFields
): Promise<Uint8Array> {
  const verifyUrl = `${awsConfig.baseUrl}/cert/${fields.certId}`;
  const qrPng = await QRCode.toBuffer(verifyUrl, { margin: 1, width: 240 });

  let pdf: PDFDocument;
  let usedTemplate = false;
  try {
    pdf = await PDFDocument.load(await fetchTemplate());
    usedTemplate = true;
  } catch {
    // No template uploaded yet — generate a minimal A4-landscape certificate.
    pdf = await PDFDocument.create();
    pdf.addPage([842, 595]);
  }

  const page = pdf.getPages()[0];
  const { width, height } = page.getSize();
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const regular = await pdf.embedFont(StandardFonts.Helvetica);

  const centerText = (text: string, y: number, size: number, color = NAVY) => {
    const w = bold.widthOfTextAtSize(text, size);
    page.drawText(text, { x: width / 2 - w / 2, y, size, font: bold, color });
  };

  if (!usedTemplate) {
    centerText("CERTIFICADO DE PARTICIPACIÓN", height - 130, 22);
    page.drawText("AWS Student Builder Group · UPB Cochabamba", {
      x: 60,
      y: height - 160,
      size: 11,
      font: regular,
      color: INK,
    });
    centerText("Se otorga a", height / 2 + 70, 14, INK);
  }

  // Overlay the dynamic fields. Adjust Y positions to match your template.
  centerText(fields.participantName, height / 2 + 20, 30);
  centerText(`por su participación en ${fields.eventName}`, height / 2 - 30, 14, INK);
  centerText(fields.date, height / 2 - 70, 12, INK);

  // Verification QR (bottom-right) + URL (bottom-left).
  const qrImg = await pdf.embedPng(qrPng);
  const qrSize = 72;
  page.drawImage(qrImg, {
    x: width - qrSize - 40,
    y: 40,
    width: qrSize,
    height: qrSize,
  });
  page.drawText(`Verificá este certificado: ${verifyUrl}`, {
    x: 40,
    y: 46,
    size: 8,
    font: regular,
    color: INK,
  });

  return pdf.save();
}
