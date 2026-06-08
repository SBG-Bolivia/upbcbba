"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get("next") || "/admin";
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        setError(res.status === 401 ? "Contraseña incorrecta" : "Error al iniciar sesión");
        return;
      }
      router.replace(next);
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <main
      className="min-h-screen flex items-center justify-center px-6 py-20 text-white"
      style={{
        background:
          "radial-gradient(900px 500px at 80% -10%, rgba(92,242,200,.15), transparent 60%), linear-gradient(180deg, #02093a 0%, #06175d 100%)",
      }}
    >
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm rounded-2xl border border-white/[0.1] bg-white/[0.04] p-8"
      >
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/40 mb-6">
          <span className="text-signal-600">●</span> AWS SBG · Admin
        </p>
        <h1 className="text-white font-semibold text-lg mb-2">Iniciar sesión</h1>
        <p className="text-white/45 text-sm mb-6">
          Panel de emisión de certificados.
        </p>
        <label className="block text-[11px] uppercase tracking-[0.12em] text-white/40 mb-1.5">
          Contraseña
        </label>
        <input
          autoFocus
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-white/15 bg-white/[0.04] px-3 py-2 text-sm text-white outline-none focus:border-white/40"
        />
        {error && <p className="mt-3 text-sm text-red-300">{error}</p>}
        <button
          type="submit"
          disabled={busy || !password}
          className="mt-6 w-full rounded-lg bg-signal-500 px-4 py-2 text-sm font-medium text-ink-950 hover:bg-signal-600 disabled:opacity-50"
        >
          {busy ? "Verificando…" : "Entrar"}
        </button>
      </form>
    </main>
  );
}
