import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import {
  findParticipantByEmail,
  getEvent,
  listAttendanceByEvent,
  putAttendance,
  putParticipant,
  setAttendanceVerified,
} from "@/lib/aws/repo";
import type { AttendanceRecord, Participant } from "@/lib/aws/types";

export const dynamic = "force-dynamic";

interface ImportRow {
  name: string;
  email: string;
}

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  const event = await getEvent(id);
  if (!event) return NextResponse.json({ error: "not found" }, { status: 404 });
  const attendance = await listAttendanceByEvent(id);
  return NextResponse.json({ event, attendance });
}

export async function POST(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id: eventId } = await ctx.params;
  const event = await getEvent(eventId);
  if (!event) return NextResponse.json({ error: "event not found" }, { status: 404 });

  const body = (await req.json().catch(() => null)) as { rows?: ImportRow[] } | null;
  const rows = body?.rows ?? [];
  if (!Array.isArray(rows) || rows.length === 0) {
    return NextResponse.json({ error: "rows required" }, { status: 400 });
  }

  const now = new Date().toISOString();
  const results: { email: string; ok: boolean; participantId?: string; error?: string }[] = [];

  for (const raw of rows) {
    const name = raw.name?.trim();
    const email = raw.email?.trim().toLowerCase();
    if (!name || !email) {
      results.push({ email: raw.email ?? "", ok: false, error: "name and email required" });
      continue;
    }
    try {
      let participant = await findParticipantByEmail(email);
      if (!participant) {
        participant = {
          participantId: randomUUID(),
          name,
          email,
          createdAt: now,
        } satisfies Participant;
        await putParticipant(participant);
      }
      const record: AttendanceRecord = {
        eventId,
        participantId: participant.participantId,
        name: participant.name,
        email,
        verified: false,
      };
      await putAttendance(record);
      results.push({ email, ok: true, participantId: participant.participantId });
    } catch (e) {
      const error = e as Error;
      console.error("[attendance import]", { email, error: error.message, stack: error.stack });
      results.push({ email, ok: false, error: error.message });
    }
  }

  return NextResponse.json({ results });
}

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id: eventId } = await ctx.params;
  const body = (await req.json().catch(() => null)) as
    | { participantId?: string; verified?: boolean }
    | null;
  if (!body?.participantId || typeof body.verified !== "boolean") {
    return NextResponse.json(
      { error: "participantId and verified required" },
      { status: 400 }
    );
  }
  await setAttendanceVerified(eventId, body.participantId, body.verified);
  return NextResponse.json({ ok: true });
}
