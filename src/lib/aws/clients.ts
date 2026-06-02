import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { S3Client } from "@aws-sdk/client-s3";
import { SESv2Client } from "@aws-sdk/client-sesv2";
import { awsConfig } from "./env";

/**
 * Lazy singletons. We don't construct the clients at module load so that simply
 * importing this file (e.g. during `next build`) never requires credentials.
 */

let _ddb: DynamoDBDocumentClient | null = null;
let _s3: S3Client | null = null;
let _ses: SESv2Client | null = null;

export function ddb(): DynamoDBDocumentClient {
  if (!_ddb) {
    _ddb = DynamoDBDocumentClient.from(
      new DynamoDBClient({ region: awsConfig.region }),
      { marshallOptions: { removeUndefinedValues: true } }
    );
  }
  return _ddb;
}

export function s3(): S3Client {
  if (!_s3) _s3 = new S3Client({ region: awsConfig.region });
  return _s3;
}

export function ses(): SESv2Client {
  if (!_ses) _ses = new SESv2Client({ region: awsConfig.region });
  return _ses;
}
