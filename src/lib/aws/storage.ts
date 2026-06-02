/** S3 helpers: certificate template + generated PDFs. */

import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3 } from "./clients";
import { awsConfig } from "./env";

/** Loads the AWS-provided certificate template PDF from S3. */
export async function fetchTemplate(): Promise<Uint8Array> {
  const out = await s3().send(
    new GetObjectCommand({
      Bucket: awsConfig.s3Bucket,
      Key: awsConfig.certTemplateKey,
    })
  );
  if (!out.Body) throw new Error("Certificate template not found in S3");
  return out.Body.transformToByteArray();
}

/** Stores a generated certificate PDF. */
export async function uploadCertificatePdf(
  key: string,
  pdf: Uint8Array
): Promise<void> {
  await s3().send(
    new PutObjectCommand({
      Bucket: awsConfig.s3Bucket,
      Key: key,
      Body: pdf,
      ContentType: "application/pdf",
    })
  );
}

/**
 * Returns a short-lived presigned URL so a participant can download their PDF.
 * The bucket stays private; the link expires (default 5 minutes).
 */
export async function getCertificateDownloadUrl(
  key: string,
  expiresIn = 300
): Promise<string> {
  return getSignedUrl(
    s3(),
    new GetObjectCommand({ Bucket: awsConfig.s3Bucket, Key: key }),
    { expiresIn }
  );
}
