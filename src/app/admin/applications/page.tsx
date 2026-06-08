import Link from "next/link";
import {
  DEPARTMENTS,
  listApplications,
  type Department,
} from "@/lib/supabase/applications";
import ApplicationsClient from "./ApplicationsClient";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ department?: string }>;
}

export default async function AdminApplicationsPage({
  searchParams,
}: PageProps) {
  const sp = await searchParams;
  const filter = DEPARTMENTS.includes(sp.department as Department)
    ? (sp.department as Department)
    : null;

  let applications: Awaited<ReturnType<typeof listApplications>> = [];
  let loadError: string | null = null;
  try {
    applications = await listApplications(filter ?? undefined);
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
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/40 mb-2">
              <span className="text-signal-600">●</span> UPB Builders · Admin
            </p>
            <h1 className="text-2xl font-semibold mb-1">Postulaciones</h1>
            <p className="text-white/50 text-sm">
              Revisá quién se postuló al equipo y descargá su CV.
            </p>
          </div>
          <Link
            href="/admin"
            className="text-[12px] font-mono uppercase tracking-[0.12em] text-white/45 hover:text-white/80"
          >
            ← Eventos
          </Link>
        </div>

        {loadError && (
          <div className="mb-6 rounded-lg border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-200">
            No se pudieron cargar postulaciones: {loadError}
          </div>
        )}

        <ApplicationsClient
          initial={applications}
          selectedDepartment={filter}
        />
      </div>
    </main>
  );
}
