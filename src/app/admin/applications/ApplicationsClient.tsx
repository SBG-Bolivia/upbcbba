"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  APPLICATION_STATUSES,
  DEPARTMENT_LABELS,
  DEPARTMENTS,
  STATUS_LABELS,
  type ApplicationStatus,
  type Department,
  type JobApplication,
} from "@/lib/supabase/applications";

interface Props {
  initial: JobApplication[];
  selectedDepartment: Department | null;
}

const STATUS_BADGE: Record<ApplicationStatus, string> = {
  pending: "bg-white/10 text-white/70 border-white/15",
  contacted: "bg-signal-500/15 text-signal-300 border-signal-500/30",
  hired: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  rejected: "bg-red-500/15 text-red-300 border-red-500/30",
};

export default function ApplicationsClient({
  initial,
  selectedDepartment,
}: Props) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [rows, setRows] = useState(initial);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function selectDepartment(d: Department | null) {
    const url = d ? `/admin/applications?department=${d}` : "/admin/applications";
    startTransition(() => router.push(url));
  }

  async function changeStatus(id: string, status: ApplicationStatus) {
    setBusyId(id);
    setError(null);
    const prev = rows;
    setRows((r) => r.map((x) => (x.id === id ? { ...x, status } : x)));
    try {
      const res = await fetch(`/api/admin/applications/${id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        setRows(prev);
        setError("No se pudo actualizar el estado.");
      }
    } catch {
      setRows(prev);
      setError("Error de red al actualizar.");
    } finally {
      setBusyId(null);
    }
  }

  async function downloadCv(id: string) {
    setBusyId(id);
    setError(null);
    try {
      const res = await fetch(`/api/admin/applications/${id}/cv`);
      const data = (await res.json().catch(() => null)) as
        | { url?: string; error?: string }
        | null;
      if (!res.ok || !data?.url) {
        setError(data?.error ?? "No se pudo generar el link de descarga.");
        return;
      }
      window.open(data.url, "_blank", "noopener,noreferrer");
    } catch {
      setError("Error de red al pedir el CV.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-5">
        <Chip
          active={selectedDepartment === null}
          onClick={() => selectDepartment(null)}
        >
          Todos
        </Chip>
        {DEPARTMENTS.map((d) => (
          <Chip
            key={d}
            active={selectedDepartment === d}
            onClick={() => selectDepartment(d)}
          >
            {DEPARTMENT_LABELS[d]}
          </Chip>
        ))}
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-200">
          {error}
        </div>
      )}

      <div className="rounded-2xl border border-white/[0.1] bg-white/[0.03] overflow-hidden">
        <div className="grid grid-cols-[1.4fr_1.2fr_1fr_140px_140px] gap-4 px-5 py-3 text-[11px] uppercase tracking-[0.12em] text-white/40 border-b border-white/[0.08]">
          <div>Postulante</div>
          <div>Equipo · LinkedIn</div>
          <div>Recibida</div>
          <div>Estado</div>
          <div className="text-right">CV</div>
        </div>

        {rows.length === 0 ? (
          <div className="px-5 py-8 text-sm text-white/40">
            No hay postulaciones {selectedDepartment ? "en este equipo" : "todavía"}.
          </div>
        ) : (
          rows.map((a) => (
            <div
              key={a.id}
              className="grid grid-cols-[1.4fr_1.2fr_1fr_140px_140px] gap-4 px-5 py-3 text-sm border-b border-white/[0.05] last:border-b-0 items-center"
            >
              <div>
                <div className="text-white">{a.name}</div>
                <a
                  href={`mailto:${a.email}`}
                  className="text-white/50 text-xs hover:text-white/80"
                >
                  {a.email}
                </a>
              </div>
              <div>
                <div className="text-white/80 text-xs">
                  {DEPARTMENT_LABELS[a.department]}
                </div>
                {a.linkedinUrl ? (
                  <a
                    href={a.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-signal-400 text-xs hover:text-signal-300 truncate block max-w-[220px]"
                  >
                    {a.linkedinUrl.replace(/^https?:\/\//, "")}
                  </a>
                ) : (
                  <span className="text-white/30 text-xs">—</span>
                )}
              </div>
              <div className="text-white/60 text-xs">
                {formatDate(a.submittedAt)}
              </div>
              <div>
                <span
                  className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-[0.1em] border ${STATUS_BADGE[a.status]}`}
                >
                  {STATUS_LABELS[a.status]}
                </span>
                <select
                  value={a.status}
                  disabled={busyId === a.id}
                  onChange={(e) =>
                    changeStatus(a.id, e.target.value as ApplicationStatus)
                  }
                  className="mt-1.5 w-full bg-white/[0.06] border border-white/[0.1] rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-signal-600/60"
                >
                  {APPLICATION_STATUSES.map((s) => (
                    <option key={s} value={s} className="bg-navy-900 text-white">
                      {STATUS_LABELS[s]}
                    </option>
                  ))}
                </select>
              </div>
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => downloadCv(a.id)}
                  disabled={busyId === a.id}
                  className="px-3 py-1.5 rounded-md bg-signal-500 text-ink-950 text-xs font-medium hover:bg-signal-600 disabled:opacity-50"
                >
                  Descargar CV
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
        active
          ? "bg-signal-500 text-ink-950 border-signal-500"
          : "bg-white/[0.04] text-white/70 border-white/[0.1] hover:bg-white/[0.08] hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("es-AR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}
