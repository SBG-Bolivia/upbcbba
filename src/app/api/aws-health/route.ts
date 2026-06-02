/**
 * Connection health check for the certificate backend.
 *
 * GET /api/aws-health → probes DynamoDB + S3 + reports SES config, so you can
 * confirm the AWS credentials/resources are wired up correctly.
 *
 * NOTE: protect or remove this route before going to production (it exposes
 * which resources are reachable). See docs/aws-certificates.md.
 */

import { NextResponse } from "next/server";
import { HeadBucketCommand } from "@aws-sdk/client-s3";
import { GetCommand } from "@aws-sdk/lib-dynamodb";
import { ddb, s3 } from "@/lib/aws/clients";
import { awsConfig } from "@/lib/aws/env";

export const dynamic = "force-dynamic";

async function probe(fn: () => Promise<unknown>) {
  try {
    await fn();
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: (e as Error).name || "Error" };
  }
}

export async function GET() {
  const dynamoCheck = await probe(() =>
    // A get on a non-existent key is cheap and only needs table read access.
    ddb().send(
      new GetCommand({
        TableName: awsConfig.tables.certificates,
        Key: { certId: "__healthcheck__" },
      })
    )
  );

  const s3Check = awsConfig.s3Bucket
    ? await probe(() =>
        s3().send(new HeadBucketCommand({ Bucket: awsConfig.s3Bucket }))
      )
    : { ok: false as const, error: "SBG_S3_BUCKET not set" };

  return NextResponse.json({
    region: awsConfig.region,
    dynamodb: { ...dynamoCheck, table: awsConfig.tables.certificates },
    s3: { ...s3Check, bucket: awsConfig.s3Bucket || null },
    ses: {
      configured: Boolean(awsConfig.sesSender),
      sender: awsConfig.sesSender || null,
    },
    baseUrl: awsConfig.baseUrl,
  });
}
