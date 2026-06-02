/**
 * Central AWS configuration for the certificate system.
 *
 * Credentials are NOT read here — the AWS SDK resolves them from the default
 * provider chain: the Amplify compute role in production, and your local AWS
 * CLI profile / environment variables in development. So this file only needs
 * region + resource names.
 */

export const awsConfig = {
  // In Lambda/Amplify SSR, AWS_REGION is set automatically by the runtime.
  region:
    process.env.AWS_REGION || process.env.SBG_AWS_REGION || "us-east-1",

  tables: {
    events: process.env.SBG_DDB_EVENTS || "sbg-cert-events",
    participants: process.env.SBG_DDB_PARTICIPANTS || "sbg-cert-participants",
    attendance: process.env.SBG_DDB_ATTENDANCE || "sbg-cert-attendance",
    certificates: process.env.SBG_DDB_CERTIFICATES || "sbg-cert-certificates",
  },

  s3Bucket: process.env.SBG_S3_BUCKET || "",
  certTemplateKey:
    process.env.SBG_CERT_TEMPLATE_KEY || "templates/certificate-template.pdf",

  sesSender: process.env.SBG_SES_SENDER || "",

  // Used to build the public verification URL embedded in the QR code + email.
  baseUrl:
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
} as const;

/**
 * Throws a clear error if the env vars required to *issue* certificates are
 * missing. Read paths (verification page) don't need bucket/sender, so this is
 * only called from the issuance flow — not at import time.
 */
export function assertConfigured(): void {
  const missing: string[] = [];
  if (!awsConfig.s3Bucket) missing.push("SBG_S3_BUCKET");
  if (!awsConfig.sesSender) missing.push("SBG_SES_SENDER");
  if (missing.length) {
    throw new Error(
      `AWS certificate system not configured — missing env var(s): ${missing.join(", ")}. See docs/aws-certificates.md`
    );
  }
}
