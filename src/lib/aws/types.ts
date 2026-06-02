/** Data models for the certificate system (DynamoDB items). */

export type EventStatus = "draft" | "open" | "closed";

export interface SbgEvent {
  eventId: string; // PK
  name: string;
  date: string; // ISO date (yyyy-mm-dd)
  location?: string;
  description?: string;
  status: EventStatus;
  createdAt: string; // ISO timestamp
}

export interface Participant {
  participantId: string; // PK
  name: string;
  email: string; // GSI: email-index
  carrera?: string;
  phone?: string;
  createdAt: string;
}

export interface AttendanceRecord {
  eventId: string; // PK
  participantId: string; // SK
  name: string; // denormalized for the admin reconciliation view
  email: string;
  verified: boolean; // admin confirmed the person actually attended
  checkedInAt?: string;
}

export type CertificateStatus = "issued" | "revoked";

export interface Certificate {
  certId: string; // PK — the public, unguessable verification id (UUID)
  eventId: string; // GSI: eventId-index
  eventName: string;
  participantId: string;
  participantName: string;
  issuedAt: string;
  s3Key: string; // location of the generated PDF in S3
  status: CertificateStatus;
}
