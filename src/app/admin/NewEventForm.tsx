"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function NewEventForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/events", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, date, location: location || undefined }),
      });
      if (!res.ok) {
        setError("No se pudo crear el evento");
        return;
      }
      setName("");
      setDate("");
      setLocation("");
      setOpen(false);
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="rounded-lg bg-signal-500 px-4 py-2 text-sm font-medium text-ink-950 hover:bg-signal-600"
      >
        + Nuevo evento
      </button>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-white/[0.1] bg-white/[0.04] p-5 grid gap-3"
    >
      <div className="grid gap-1">
        <label className="text-[11px] uppercase tracking-[0.12em] text-white/40">
          Nombre del evento
        </label>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded-lg border border-white/15 bg-white/[0.04] px-3 py-2 text-sm text-white outline-none focus:border-white/40"
          placeholder="AWS Workshop · Intro to Lambda"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="grid gap-1">
          <label className="text-[11px] uppercase tracking-[0.12em] text-white/40">
            Fecha
          </label>
          <input
            required
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="rounded-lg border border-white/15 bg-white/[0.04] px-3 py-2 text-sm text-white outline-none focus:border-white/40 [color-scheme:dark]"
          />
        </div>
        <div className="grid gap-1">
          <label className="text-[11px] uppercase tracking-[0.12em] text-white/40">
            Ubicación (opcional)
          </label>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="rounded-lg border border-white/15 bg-white/[0.04] px-3 py-2 text-sm text-white outline-none focus:border-white/40"
            placeholder="UPB · Aula M1"
          />
        </div>
      </div>
      {error && <p className="text-sm text-red-300">{error}</p>}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={busy || !name || !date}
          className="rounded-lg bg-signal-500 px-4 py-2 text-sm font-medium text-ink-950 hover:bg-signal-600 disabled:opacity-50"
        >
          {busy ? "Guardando…" : "Crear"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-lg border border-white/15 px-4 py-2 text-sm text-white/70 hover:bg-white/[0.04]"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
