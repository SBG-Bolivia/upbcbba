import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { listEvents, putEvent } from "@/lib/aws/repo";
import type { SbgEvent } from "@/lib/aws/types";

export const dynamic = "force-dynamic";

export async function GET() {
  const events = await listEvents();
  return NextResponse.json({ events });
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as Partial<SbgEvent> | null;
  if (!body?.name || !body?.date) {
    return NextResponse.json({ error: "name and date required" }, { status: 400 });
  }
  const event: SbgEvent = {
    eventId: randomUUID(),
    name: body.name,
    date: body.date,
    location: body.location,
    description: body.description,
    status: body.status ?? "open",
    createdAt: new Date().toISOString(),
  };
  await putEvent(event);
  return NextResponse.json({ event });
}
