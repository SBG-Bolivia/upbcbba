"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

const MEMBERS = [
  { name: "Valentina Cruz",    carrera: "Ing. Sistemas",  initials: "VC", color: "#06175D" },
  { name: "Diego Mamani",      carrera: "Ing. Civil",     initials: "DM", color: "#1a3aad" },
  { name: "Camila Rojas",      carrera: "Diseño Gráfico", initials: "CR", color: "#0fa37c" },
  { name: "Mateo Torrico",     carrera: "Economía",       initials: "MT", color: "#0b2281" },
  { name: "Sofía Villanueva",  carrera: "Ing. Sistemas",  initials: "SV", color: "#1ed4a2", dark: true },
  { name: "Andrés Peña",       carrera: "Administración", initials: "AP", color: "#06175D" },
  { name: "Lucía Flores",      carrera: "Medicina",       initials: "LF", color: "#4a68d6" },
  { name: "Gabriel Soria",     carrera: "Ing. Industrial",initials: "GS", color: "#0b2281" },
  { name: "Isabella Vargas",   carrera: "Derecho",        initials: "IV", color: "#5cf2c8", dark: true },
  { name: "Sebastián Arias",   carrera: "Ing. Sistemas",  initials: "SA", color: "#02093a" },
  { name: "Natalia Gutiérrez", carrera: "Arquitectura",   initials: "NG", color: "#ff8a3d", dark: true },
  { name: "Emilio Chávez",     carrera: "Filosofía",      initials: "EC", color: "#1a3aad" },
];

export default function Members() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: headRef.current, start: "top 82%" },
        }
      );
      gsap.fromTo(
        gridRef.current?.children ? Array.from(gridRef.current.children) : [],
        { opacity: 0, y: 24, scale: 0.95 },
        {
          opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.05,
          ease: "power3.out",
          scrollTrigger: { trigger: gridRef.current, start: "top 82%" },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="miembros"
      ref={sectionRef}
      className="py-24 bg-navy-900 dark:bg-ink-950 border-b border-white/[0.06]"
    >
      <div className="max-w-[1240px] mx-auto px-6 md:px-8">
        <div ref={headRef} className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-12 mb-14">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/40">
              <span className="text-signal-600">●</span> 04 / Miembros
            </p>
          </div>
          <div>
            <h2
              className="text-[clamp(28px,4vw,44px)] font-semibold text-white mb-4 leading-[1.05]"
              style={{ letterSpacing: "-0.025em" }}
            >
              Quiénes están construyendo.
            </h2>
            <p className="text-[16px] text-white/50 leading-relaxed max-w-xl">
              148 miembros activos en 9 carreras. Estas son algunas de las
              personas que ya están adentro.
            </p>
          </div>
        </div>

        <div
          ref={gridRef}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3"
        >
          {MEMBERS.map((m) => (
            <div
              key={m.name}
              className="group flex flex-col items-center gap-3 p-4 rounded-xl border border-white/[0.06] hover:border-white/[0.14] bg-white/[0.02] hover:bg-white/[0.05] transition-all cursor-default"
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 ring-2 ring-white/10 group-hover:ring-signal-600/40 transition-all"
                style={{
                  background: m.color,
                  color: m.dark ? "#060814" : "white",
                }}
              >
                {m.initials}
              </div>
              <div className="text-center">
                <p className="text-white text-[12px] font-medium leading-tight mb-1">
                  {m.name}
                </p>
                <p className="font-mono text-[9px] uppercase tracking-[0.1em] text-white/40">
                  {m.carrera}
                </p>
              </div>
            </div>
          ))}

          {/* +136 more card */}
          <div className="flex flex-col items-center gap-3 p-4 rounded-xl border border-white/[0.06] bg-white/[0.02]">
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold bg-white/[0.06] text-white/40 ring-2 ring-white/10">
              +136
            </div>
            <div className="text-center">
              <p className="font-mono text-[9px] uppercase tracking-[0.1em] text-white/40 mt-1">
                Más miembros
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
