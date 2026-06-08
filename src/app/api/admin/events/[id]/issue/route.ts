import { NextResponse } from "next/server";
import { assertConfigured } from "@/lib/aws/env";
import { issueCertificate } from "@/lib/aws/issue";
import {
  getEvent,
  listAttendanceByEvent,
  listCertificatesByEvent,
} from "@/lib/aws/repo";

export const dynamic = "force-dynamic";

export async function POST(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  assertConfigured();
  const { id: eventId } = await ctx.params;
  const event = await getEvent(eventId);
  if (!event) return NextResponse.json({ error: "event not found" }, { status: 404 });

  const [attendance, existing] = await Promise.all([
    listAttendanceByEvent(eventId),
    listCertificatesByEvent(eventId),
  ]);

  const alreadyIssued = new Set(existing.map((c) => c.participantId));
  const eligible = attendance.filter(
    (a) => a.verified && !alreadyIssued.has(a.participantId)
  );

  const results: {
    participantId: string;
    email: string;
    ok: boolean;
    certId?: string;
    error?: string;
  }[] = [];

  for (const a of eligible) {
    try {
      const cert = await issueCertificate({
        eventId,
        eventName: event.name,
        participantId: a.participantId,
        participantName: a.name,
        email: a.email,
        date: event.date,
      });
      results.push({
        participantId: a.participantId,
        email: a.email,
        ok: true,
        certId: cert.certId,
      });
    } catch (e) {
      results.push({
        participantId: a.participantId,
        email: a.email,
        ok: false,
        error: (e as Error).message,
      });
    }
  }

  return NextResponse.json({
    issued: results.filter((r) => r.ok).length,
    skipped: alreadyIssued.size,
    failed: results.filter((r) => !r.ok).length,
    results,
  });
}
