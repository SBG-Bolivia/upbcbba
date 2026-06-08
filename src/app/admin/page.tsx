import Link from "next/link";
import { listEvents } from "@/lib/aws/repo";
import { NewEventForm } from "./NewEventForm";

export const dynamic = "force-dynamic";

export default async function AdminHomePage() {
  let events: Awaited<ReturnType<typeof listEvents>> = [];
  let loadError: string | null = null;
  try {
    events = await listEvents();
  } catch (e) {
    loadError = (e as Error).message;
  }

  return (
    <main
      className="min-h-screen px-6 py-12 text-white"
      style={{
        background:
          "radial-gradient(900px 500px at 80% -10%, rgba(92,242,200,.15), transparent 60%), linear-gradient(180deg, #02093a 0%, #06175d 100%)",
      }}
    >
      <div className="mx-auto max-w-4xl">
        <div className="flex items-start justify-between mb-8">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/40 mb-2">
              <span className="text-signal-600">●</span> AWS SBG · Admin
            </p>
            <h1 className="text-2xl font-semibold mb-1">Eventos</h1>
            <p className="text-white/50 text-sm">
              Creá eventos, importá asistencia y emití certificados.
            </p>
          </div>
          <Link
            href="/admin/applications"
            className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/[0.06] border border-white/[0.1] text-white/80 hover:bg-white/[0.1] hover:text-white"
          >
            Postulaciones →
          </Link>
        </div>

        <NewEventForm />

        {loadError && (
          <div className="mt-8 rounded-lg border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-200">
            No se pudo cargar eventos: {loadError}
          </div>
        )}

        <div className="mt-8 rounded-2xl border border-white/[0.1] bg-white/[0.03] overflow-hidden">
          <div className="grid grid-cols-[1fr_120px_100px] gap-4 px-5 py-3 text-[11px] uppercase tracking-[0.12em] text-white/40 border-b border-white/[0.08]">
            <div>Evento</div>
            <div>Fecha</div>
            <div>Estado</div>
          </div>
          {events.length === 0 ? (
            <div className="px-5 py-6 text-sm text-white/40">
              Aún no hay eventos. Creá el primero arriba.
            </div>
          ) : (
            events.map((ev) => (
              <Link
                key={ev.eventId}
                href={`/admin/events/${ev.eventId}`}
                className="grid grid-cols-[1fr_120px_100px] gap-4 px-5 py-3 text-sm border-b border-white/[0.05] last:border-b-0 hover:bg-white/[0.04]"
              >
                <div>
                  <div className="text-white">{ev.name}</div>
                  {ev.location && (
                    <div className="text-white/40 text-xs">{ev.location}</div>
                  )}
                </div>
                <div className="text-white/70">{ev.date}</div>
                <div className="text-white/60 capitalize">{ev.status}</div>
              </Link>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
