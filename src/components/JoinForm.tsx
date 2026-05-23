"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

const CARRERAS = [
  "Ing. de Sistemas",
  "Ing. Civil",
  "Ing. Industrial",
  "Administración de Empresas",
  "Diseño Gráfico",
  "Medicina",
  "Derecho",
  "Arquitectura",
  "Economía",
  "Filosofía",
  "Otra",
];

type FormState = "idle" | "submitting" | "success";

export default function JoinForm() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<FormState>("idle");
  const [form, setForm] = useState({
    name: "", email: "", carrera: "", building: "",
  });

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 1, ease: "power3.out",
          scrollTrigger: { trigger: cardRef.current, start: "top 80%" },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("submitting");
    await new Promise((r) => setTimeout(r, 900));
    setState("success");
  };

  const set = (k: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <section
      id="unete"
      ref={sectionRef}
      className="py-24 bg-navy-900 dark:bg-ink-950"
    >
      <div className="max-w-[1240px] mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left copy */}
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/40 mb-6">
              <span className="text-signal-600">●</span> Únete al grupo
            </p>
            <h2
              className="text-[clamp(28px,4vw,48px)] font-semibold text-white mb-6 leading-[1.05]"
              style={{ letterSpacing: "-0.03em" }}
            >
              Shipea algo este semestre. Nosotros ayudamos.
            </h2>
            <p className="text-[16px] text-white/55 leading-relaxed mb-8 max-w-md">
              Llenate el formulario y te mandamos la info del próximo evento.
              Membresía gratis, sin burocracia.
            </p>
            <div className="flex flex-col gap-3">
              {[
                "Demo nights cada dos semanas",
                "AWS credits para tus proyectos",
                "Acceso al canal de Discord",
                "Mentorías y workshops",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-signal-600 shrink-0" />
                  <span className="text-sm text-white/65">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right form */}
          <div
            ref={cardRef}
            className="rounded-2xl border border-white/[0.1] bg-white/[0.04] p-7 md:p-8"
          >
            {state === "success" ? (
              <div className="flex flex-col items-center justify-center gap-4 py-8 text-center">
                <div className="w-12 h-12 rounded-full bg-signal-600/20 flex items-center justify-center">
                  <span className="text-signal-500 text-xl">✓</span>
                </div>
                <h3 className="text-white font-semibold text-lg">¡Listo!</h3>
                <p className="text-white/55 text-sm max-w-xs">
                  Te mandamos la info del próximo evento a tu correo. Nos vemos
                  en el Demo Night.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/45">
                      Nombre completo
                    </label>
                    <input
                      required
                      value={form.name}
                      onChange={set("name")}
                      placeholder="Camila Rojas"
                      className="w-full bg-white/[0.06] border border-white/[0.1] rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-signal-600/60 focus:ring-2 focus:ring-signal-600/20 transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/45">
                      Correo UPB
                    </label>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={set("email")}
                      placeholder="c.rojas@upb.edu"
                      className="w-full bg-white/[0.06] border border-white/[0.1] rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-signal-600/60 focus:ring-2 focus:ring-signal-600/20 transition-all"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/45">
                    Carrera
                  </label>
                  <select
                    required
                    value={form.carrera}
                    onChange={set("carrera")}
                    className="w-full bg-white/[0.06] border border-white/[0.1] rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-signal-600/60 focus:ring-2 focus:ring-signal-600/20 transition-all appearance-none"
                  >
                    <option value="" className="bg-navy-900 text-white/50">
                      Seleccioná tu carrera...
                    </option>
                    {CARRERAS.map((c) => (
                      <option key={c} value={c} className="bg-navy-900 text-white">
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/45">
                    ¿Qué estás construyendo?
                  </label>
                  <textarea
                    value={form.building}
                    onChange={set("building")}
                    placeholder="Una app para gestionar horarios de la UPB…"
                    rows={3}
                    className="w-full bg-white/[0.06] border border-white/[0.1] rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-signal-600/60 focus:ring-2 focus:ring-signal-600/20 transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={state === "submitting"}
                  className="w-full py-3 rounded-lg font-medium text-sm bg-signal-500 text-ink-950 hover:bg-signal-600 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                >
                  {state === "submitting" ? "Enviando…" : "Únete al grupo →"}
                </button>

                <p className="text-[11px] text-white/30 text-center font-mono">
                  Sin spam. Solo info de eventos y recursos.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
