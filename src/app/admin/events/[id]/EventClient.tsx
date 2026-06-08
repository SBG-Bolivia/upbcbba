"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

type Row = {
  eventId: string;
  participantId: string;
  name: string;
  email: string;
  verified: boolean;
  issued: boolean;
};

export function EventClient({
  eventId,
  initialAttendance,
}: {
  eventId: string;
  initialAttendance: Row[];
}) {
  const router = useRouter();
  const [rows, setRows] = useState<Row[]>(initialAttendance);
  const [bulk, setBulk] = useState("");
  const [importing, setImporting] = useState(false);
  const [importLog, setImportLog] = useState<string | null>(null);
  const [importErrors, setImportErrors] = useState<
    { email: string; error?: string }[]
  >([]);
  const [issuing, setIssuing] = useState(false);
  const [issueLog, setIssueLog] = useState<
    { email: string; ok: boolean; error?: string }[] | null
  >(null);
  const [, startTransition] = useTransition();

  const eligibleCount = useMemo(
    () => rows.filter((r) => r.verified && !r.issued).length,
    [rows]
  );

  async function onToggle(participantId: string, next: boolean) {
    setRows((rs) =>
      rs.map((r) => (r.participantId === participantId ? { ...r, verified: next } : r))
    );
    try {
      await fetch(`/api/admin/events/${eventId}/attendance`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ participantId, verified: next }),
      });
    } catch {
      // revert on failure
      setRows((rs) =>
        rs.map((r) =>
          r.participantId === participantId ? { ...r, verified: !next } : r
        )
      );
    }
  }

  async function onImport() {
    const parsed = bulk
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [namePart, ...rest] = line.split(/[,;\t]/);
        const emailPart = rest.join(",").trim();
        return { name: namePart?.trim() ?? "", email: emailPart };
      })
      .filter((r) => r.name && r.email);

    if (parsed.length === 0) {
      setImportLog("Pegá filas con formato: Nombre, email");
      return;
    }
    setImporting(true);
    setImportLog(null);
    setImportErrors([]);
    try {
      const res = await fetch(`/api/admin/events/${eventId}/attendance`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ rows: parsed }),
      });
      if (!res.ok) {
        const body = await res.text();
        setImportLog(`Error HTTP ${res.status}: ${body.slice(0, 200)}`);
        return;
      }
      const data = (await res.json()) as {
        results: { email: string; ok: boolean; error?: string }[];
      };
      const okRows = data.results.filter((r) => r.ok);
      const failRows = data.results.filter((r) => !r.ok);
      setImportLog(`${okRows.length} importadas, ${failRows.length} con error`);
      setImportErrors(failRows);
      if (okRows.length > 0) setBulk("");
      startTransition(() => router.refresh());
    } catch (e) {
      setImportLog(`Error: ${(e as Error).message}`);
    } finally {
      setImporting(false);
    }
  }

  async function onIssue() {
    if (eligibleCount === 0) return;
    setIssuing(true);
    setIssueLog(null);
    try {
      const res = await fetch(`/api/admin/events/${eventId}/issue`, {
        method: "POST",
      });
      const data = (await res.json()) as {
        results: { email: string; ok: boolean; error?: string }[];
      };
      setIssueLog(data.results);
      startTransition(() => router.refresh());
    } catch (e) {
      setIssueLog([{ email: "", ok: false, error: (e as Error).message }]);
    } finally {
      setIssuing(false);
    }
  }

  return (
    <div className="mt-8 grid gap-6">
      <section className="rounded-2xl border border-white/[0.1] bg-white/[0.03] p-5">
        <h2 className="text-sm font-medium text-white/80 mb-2">
          Importar asistencia
        </h2>
        <p className="text-xs text-white/40 mb-3">
          Una persona por línea: <code className="text-white/60">Nombre, email</code>
        </p>
        <textarea
          value={bulk}
          onChange={(e) => setBulk(e.target.value)}
          rows={5}
          className="w-full rounded-lg border border-white/15 bg-white/[0.04] px-3 py-2 text-sm text-white font-mono outline-none focus:border-white/40"
          placeholder={"Gabriel Olarte, gabriel@example.com\nMaría Pérez, maria@example.com"}
        />
        <div className="mt-3 flex items-center gap-3">
          <button
            onClick={onImport}
            disabled={importing || !bulk.trim()}
            className="rounded-lg bg-signal-500 px-4 py-2 text-sm font-medium text-ink-950 hover:bg-signal-600 disabled:opacity-50"
          >
            {importing ? "Importando…" : "Importar"}
          </button>
          {importLog && <span className="text-xs text-white/60">{importLog}</span>}
        </div>
        {importErrors.length > 0 && (
          <ul className="mt-3 grid gap-1 text-xs text-red-300">
            {importErrors.map((r, i) => (
              <li key={`${r.email}-${i}`}>
                ✕ {r.email || "(sin email)"} · {r.error ?? "error desconocido"}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-2xl border border-white/[0.1] bg-white/[0.03] overflow-hidden">
        <div className="px-5 py-3 border-b border-white/[0.08] flex items-center justify-between">
          <h2 className="text-sm font-medium text-white/80">
            Asistentes ({rows.length})
          </h2>
          <button
            onClick={onIssue}
            disabled={issuing || eligibleCount === 0}
            className="rounded-lg bg-signal-500 px-3 py-1.5 text-sm font-medium text-ink-950 hover:bg-signal-600 disabled:opacity-50"
          >
            {issuing
              ? "Emitiendo…"
              : `Emitir certificados (${eligibleCount})`}
          </button>
        </div>
        <div className="grid grid-cols-[1fr_1fr_80px_80px] gap-4 px-5 py-2 text-[11px] uppercase tracking-[0.12em] text-white/40 border-b border-white/[0.05]">
          <div>Nombre</div>
          <div>Email</div>
          <div>Asistió</div>
          <div>Emitido</div>
        </div>
        {rows.length === 0 ? (
          <div className="px-5 py-6 text-sm text-white/40">
            Aún no hay asistentes. Importá arriba.
          </div>
        ) : (
          rows.map((r) => (
            <div
              key={r.participantId}
              className="grid grid-cols-[1fr_1fr_80px_80px] gap-4 px-5 py-2 text-sm border-b border-white/[0.04] last:border-b-0"
            >
              <div className="text-white truncate">{r.name}</div>
              <div className="text-white/60 truncate">{r.email}</div>
              <div>
                <input
                  type="checkbox"
                  checked={r.verified}
                  onChange={(e) => onToggle(r.participantId, e.target.checked)}
                  className="h-4 w-4 accent-signal-500"
                />
              </div>
              <div className="text-xs text-white/50">
                {r.issued ? "✓" : "—"}
              </div>
            </div>
          ))
        )}
      </section>

      {issueLog && (
        <section className="rounded-2xl border border-white/[0.1] bg-white/[0.03] p-5">
          <h3 className="text-sm font-medium text-white/80 mb-2">
            Resultado de emisión
          </h3>
          <ul className="grid gap-1 text-xs">
            {issueLog.map((r, i) => (
              <li
                key={`${r.email}-${i}`}
                className={r.ok ? "text-emerald-300" : "text-red-300"}
              >
                {r.ok ? "✓" : "✕"} {r.email} {r.error ? `· ${r.error}` : ""}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
