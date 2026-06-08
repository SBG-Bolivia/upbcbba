import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getEvent,
  listAttendanceByEvent,
  listCertificatesByEvent,
} from "@/lib/aws/repo";
import { EventClient } from "./EventClient";

export const dynamic = "force-dynamic";

export default async function AdminEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = await getEvent(id);
  if (!event) notFound();

  const [attendance, certificates] = await Promise.all([
    listAttendanceByEvent(id),
    listCertificatesByEvent(id),
  ]);

  const issuedSet = new Set(certificates.map((c) => c.participantId));

  return (
    <main
      className="min-h-screen px-6 py-12 text-white"
      style={{
        background:
          "radial-gradient(900px 500px at 80% -10%, rgba(92,242,200,.15), transparent 60%), linear-gradient(180deg, #02093a 0%, #06175d 100%)",
      }}
    >
      <div className="mx-auto max-w-4xl">
        <Link
          href="/admin"
          className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/40 hover:text-white/70"
        >
          ← Eventos
        </Link>
        <h1 className="text-2xl font-semibold mt-2">{event.name}</h1>
        <p className="text-white/50 text-sm">
          {event.date}
          {event.location ? ` · ${event.location}` : ""}
        </p>

        <EventClient
          eventId={event.eventId}
          initialAttendance={attendance.map((a) => ({
            ...a,
            issued: issuedSet.has(a.participantId),
          }))}
        />
      </div>
    </main>
  );
}
