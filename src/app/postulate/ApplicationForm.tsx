"use client";

import { useState } from "react";

const DEPARTMENTS = [
  { value: "marketing", label: "Marketing / Redes Sociales" },
  { value: "it", label: "IT Support" },
  { value: "dev", label: "Dev Team" },
  { value: "eventos", label: "Relaciones / Eventos" },
] as const;

const MAX_CV_BYTES = 5 * 1024 * 1024;

type State = "idle" | "submitting" | "success" | "error";

interface Form {
  name: string;
  email: string;
  department: string;
  linkedinUrl: string;
  cv: File | null;
}

const EMPTY: Form = {
  name: "",
  email: "",
  department: "",
  linkedinUrl: "",
  cv: null,
};

export default function ApplicationForm() {
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<Form>(EMPTY);

  function set<K extends keyof Form>(key: K, value: Form[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function validate(): string | null {
    if (!form.name.trim()) return "El nombre es obligatorio.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      return "Ingresá un correo válido.";
    if (!DEPARTMENTS.some((d) => d.value === form.department))
      return "Elegí un equipo.";
    if (form.linkedinUrl.trim()) {
      try {
        const u = new URL(form.linkedinUrl.trim());
        if (!/(^|\.)linkedin\.com$/.test(u.hostname))
          return "El link debe ser de linkedin.com.";
      } catch {
        return "El link de LinkedIn no es válido.";
      }
    }
    if (!form.cv) return "Adjuntá tu CV en PDF.";
    if (form.cv.type !== "application/pdf")
      return "El CV debe ser un PDF.";
    if (form.cv.size > MAX_CV_BYTES) return "El CV no puede pesar más de 5 MB.";
    return null;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const v = validate();
    if (v) {
      setError(v);
      return;
    }
    setError(null);
    setState("submitting");
    try {
      const fd = new FormData();
      fd.append("name", form.name.trim());
      fd.append("email", form.email.trim());
      fd.append("department", form.department);
      if (form.linkedinUrl.trim())
        fd.append("linkedinUrl", form.linkedinUrl.trim());
      fd.append("cv", form.cv!);
      const res = await fetch("/api/applications", {
        method: "POST",
        body: fd,
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as
          | { error?: string }
          | null;
        setError(data?.error ?? "No pudimos enviar tu postulación.");
        setState("error");
        return;
      }
      setState("success");
    } catch {
      setError("Error de red. Probá de nuevo en un rato.");
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <div className="rounded-2xl border border-white/[0.1] bg-white/[0.04] p-8 text-center">
        <div className="w-12 h-12 rounded-full bg-signal-600/20 flex items-center justify-center mx-auto mb-4">
          <span className="text-signal-500 text-xl">✓</span>
        </div>
        <h2 className="text-white font-semibold text-lg mb-2">
          ¡Postulación recibida!
        </h2>
        <p className="text-white/55 text-sm max-w-sm mx-auto">
          La revisamos en los próximos días y te escribimos por correo si encaja
          con un equipo.
        </p>
      </div>
    );
  }

  const submitting = state === "submitting";

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-white/[0.1] bg-white/[0.04] p-7 md:p-8 flex flex-col gap-5"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Nombre completo">
          <input
            required
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="Camila Rojas"
            className={inputCls}
          />
        </Field>
        <Field label="Correo">
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            placeholder="c.rojas@upb.edu"
            className={inputCls}
          />
        </Field>
      </div>

      <Field label="Equipo">
        <select
          required
          value={form.department}
          onChange={(e) => set("department", e.target.value)}
          className={`${inputCls} appearance-none`}
        >
          <option value="" className="bg-navy-900 text-white/50">
            Elegí un equipo…
          </option>
          {DEPARTMENTS.map((d) => (
            <option
              key={d.value}
              value={d.value}
              className="bg-navy-900 text-white"
            >
              {d.label}
            </option>
          ))}
        </select>
      </Field>

      <Field label="LinkedIn (opcional)">
        <input
          type="url"
          value={form.linkedinUrl}
          onChange={(e) => set("linkedinUrl", e.target.value)}
          placeholder="https://linkedin.com/in/camila-rojas"
          className={inputCls}
        />
      </Field>

      <Field label="CV (PDF, máx 5 MB)">
        <input
          required
          type="file"
          accept="application/pdf,.pdf"
          onChange={(e) => set("cv", e.target.files?.[0] ?? null)}
          className="w-full text-sm text-white/80 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-signal-500 file:text-ink-950 file:font-medium hover:file:bg-signal-600 file:cursor-pointer"
        />
        {form.cv && (
          <p className="text-[11px] text-white/40 font-mono mt-1">
            {form.cv.name} · {(form.cv.size / 1024).toFixed(0)} KB
          </p>
        )}
      </Field>

      {error && (
        <p className="text-sm text-red-300 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-3 rounded-lg font-medium text-sm bg-signal-500 text-ink-950 hover:bg-signal-600 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
      >
        {submitting ? "Enviando…" : "Enviar postulación →"}
      </button>

      <p className="text-[11px] text-white/30 text-center font-mono">
        Tu CV se guarda en privado. Solo el equipo de UPB Builders lo ve.
      </p>
    </form>
  );
}

const inputCls =
  "w-full bg-white/[0.06] border border-white/[0.1] rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-signal-600/60 focus:ring-2 focus:ring-signal-600/20 transition-all";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/45">
        {label}
      </label>
      {children}
    </div>
  );
}
