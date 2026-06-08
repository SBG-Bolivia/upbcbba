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

const NAVY = rgb(0.024, 0.09, 0.365);
const INK = rgb(0.4, 0.4, 0.45);
const DARK_ON_GREEN = rgb(0.05, 0.18, 0.12);
const LIGHT_ON_DARK = rgb(0.95, 1.0, 0.98);
const GREEN_PANEL = rgb(0.36, 0.95, 0.62);
const DARK_PANEL = rgb(0.055, 0.125, 0.141);

const TEMPLATE_SLOTS = {
  workshopCenterX: 245,
  workshopY: 318,
  workshopSize: 22,
  studentCenterX: 645,
  studentY: 230,
  studentSize: 26,
} as const;

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
    pdf = await PDFDocument.create();
    pdf.addPage([842, 595]);
  }

  const page = pdf.getPages()[0];
  const { width, height } = page.getSize();
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const regular = await pdf.embedFont(StandardFonts.Helvetica);

  const drawCentered = (
    text: string,
    cx: number,
    y: number,
    size: number,
    color: ReturnType<typeof rgb>
  ) => {
    const w = bold.widthOfTextAtSize(text, size);
    page.drawText(text, { x: cx - w / 2, y, size, font: bold, color });
  };

  const drawWithCover = (
    text: string,
    cx: number,
    y: number,
    size: number,
    textColor: ReturnType<typeof rgb>,
    bgColor: ReturnType<typeof rgb>,
    minWidth: number
  ) => {
    const tw = bold.widthOfTextAtSize(text, size);
    const w = Math.max(tw, minWidth) + 24;
    page.drawRectangle({
      x: cx - w / 2,
      y: y - size * 0.5,
      width: w,
      height: size * 1.65,
      color: bgColor,
    });
    page.drawText(text, {
      x: cx - tw / 2,
      y,
      size,
      font: bold,
      color: textColor,
    });
  };

  if (usedTemplate) {
    drawWithCover(
      fields.eventName,
      TEMPLATE_SLOTS.workshopCenterX,
      TEMPLATE_SLOTS.workshopY,
      TEMPLATE_SLOTS.workshopSize,
      DARK_ON_GREEN,
      GREEN_PANEL,
      180
    );
    drawWithCover(
      fields.participantName,
      TEMPLATE_SLOTS.studentCenterX,
      TEMPLATE_SLOTS.studentY,
      TEMPLATE_SLOTS.studentSize,
      LIGHT_ON_DARK,
      DARK_PANEL,
      220
    );
  } else {
    drawCentered("CERTIFICADO DE PARTICIPACIÓN", width / 2, height - 130, 22, NAVY);
    page.drawText("AWS Student Builder Group · UPB Cochabamba", {
      x: 60,
      y: height - 160,
      size: 11,
      font: regular,
      color: INK,
    });
    drawCentered("Se otorga a", width / 2, height / 2 + 70, 14, INK);
    drawCentered(fields.participantName, width / 2, height / 2 + 20, 30, NAVY);
    drawCentered(
      `por su participación en ${fields.eventName}`,
      width / 2,
      height / 2 - 30,
      14,
      INK
    );
    drawCentered(fields.date, width / 2, height / 2 - 70, 12, INK);
  }

  const qrImg = await pdf.embedPng(qrPng);
  const qrSize = 64;
  page.drawImage(qrImg, {
    x: width - qrSize - 24,
    y: 24,
    width: qrSize,
    height: qrSize,
  });
  page.drawText(verifyUrl, {
    x: 24,
    y: 28,
    size: 7,
    font: regular,
    color: usedTemplate ? LIGHT_ON_DARK : INK,
  });

  return pdf.save();
}
