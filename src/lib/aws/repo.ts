/** DynamoDB data access for the certificate system. */

import {
  GetCommand,
  PutCommand,
  QueryCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { ddb } from "./clients";
import { awsConfig } from "./env";
import type {
  AttendanceRecord,
  Certificate,
  Participant,
  SbgEvent,
} from "./types";

const T = awsConfig.tables;

// ─── Events ─────────────────────────────────────────────────────────────────
export async function getEvent(eventId: string): Promise<SbgEvent | null> {
  const out = await ddb().send(
    new GetCommand({ TableName: T.events, Key: { eventId } })
  );
  return (out.Item as SbgEvent) ?? null;
}

export async function putEvent(event: SbgEvent): Promise<void> {
  await ddb().send(new PutCommand({ TableName: T.events, Item: event }));
}

// ─── Participants ─────────────────────────────────────────────────────────────
export async function putParticipant(p: Participant): Promise<void> {
  await ddb().send(new PutCommand({ TableName: T.participants, Item: p }));
}

export async function getParticipant(
  participantId: string
): Promise<Participant | null> {
  const out = await ddb().send(
    new GetCommand({ TableName: T.participants, Key: { participantId } })
  );
  return (out.Item as Participant) ?? null;
}

// ─── Attendance ───────────────────────────────────────────────────────────────
export async function putAttendance(a: AttendanceRecord): Promise<void> {
  await ddb().send(new PutCommand({ TableName: T.attendance, Item: a }));
}

export async function listAttendanceByEvent(
  eventId: string
): Promise<AttendanceRecord[]> {
  const out = await ddb().send(
    new QueryCommand({
      TableName: T.attendance,
      KeyConditionExpression: "eventId = :e",
      ExpressionAttributeValues: { ":e": eventId },
    })
  );
  return (out.Items as AttendanceRecord[]) ?? [];
}

export async function setAttendanceVerified(
  eventId: string,
  participantId: string,
  verified: boolean
): Promise<void> {
  await ddb().send(
    new UpdateCommand({
      TableName: T.attendance,
      Key: { eventId, participantId },
      UpdateExpression: "SET verified = :v",
      ExpressionAttributeValues: { ":v": verified },
    })
  );
}

// ─── Certificates ─────────────────────────────────────────────────────────────
export async function getCertificate(
  certId: string
): Promise<Certificate | null> {
  const out = await ddb().send(
    new GetCommand({ TableName: T.certificates, Key: { certId } })
  );
  return (out.Item as Certificate) ?? null;
}

export async function putCertificate(cert: Certificate): Promise<void> {
  await ddb().send(
    new PutCommand({ TableName: T.certificates, Item: cert })
  );
}

export async function listCertificatesByEvent(
  eventId: string
): Promise<Certificate[]> {
  const out = await ddb().send(
    new QueryCommand({
      TableName: T.certificates,
      IndexName: "eventId-index",
      KeyConditionExpression: "eventId = :e",
      ExpressionAttributeValues: { ":e": eventId },
    })
  );
  return (out.Items as Certificate[]) ?? [];
}

export async function revokeCertificate(certId: string): Promise<void> {
  await ddb().send(
    new UpdateCommand({
      TableName: T.certificates,
      Key: { certId },
      UpdateExpression: "SET #s = :revoked",
      ExpressionAttributeNames: { "#s": "status" },
      ExpressionAttributeValues: { ":revoked": "revoked" },
    })
  );
}
