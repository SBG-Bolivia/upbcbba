"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import TiltCardGSAP from "./TiltCardGSAP";
import { Avatar, SocialLinks } from "./SocialIcons";

export type Member = {
  name: string;
  carrera: string;
  initials: string;
  color: string;
  dark?: boolean;           // true if initials text should be dark
  image?: string;           // URL — if omitted falls back to initials
  github?: string;
  linkedin?: string;
};

// ─── Edit this list to add/update members ───────────────────────────────────
const MEMBERS: Member[] = [
  {
    name: "Valentina Cruz",
    carrera: "Ing. Sistemas",
    initials: "VC",
    color: "#06175D",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
  },
  {
    name: "Diego Mamani",
    carrera: "Ing. Civil",
    initials: "DM",
    color: "#1a3aad",
    github: "https://github.com",
  },
  {
    name: "Camila Rojas",
    carrera: "Diseño Gráfico",
    initials: "CR",
    color: "#0fa37c",
    dark: true,
    linkedin: "https://linkedin.com",
  },
  {
    name: "Mateo Torrico",
    carrera: "Economía",
    initials: "MT",
    color: "#0b2281",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
  },
  {
    name: "Sofía Villanueva",
    carrera: "Ing. Sistemas",
    initials: "SV",
    color: "#1ed4a2",
    dark: true,
    github: "https://github.com",
  },
  {
    name: "Andrés Peña",
    carrera: "Administración",
    initials: "AP",
    color: "#06175D",
    linkedin: "https://linkedin.com",
  },
  {
    name: "Lucía Flores",
    carrera: "Medicina",
    initials: "LF",
    color: "#4a68d6",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
  },
  {
    name: "Gabriel Soria",
    carrera: "Ing. Industrial",
    initials: "GS",
    color: "#0b2281",
    github: "https://github.com",
  },
  {
    name: "Isabella Vargas",
    carrera: "Derecho",
    initials: "IV",
    color: "#5cf2c8",
    dark: true,
    linkedin: "https://linkedin.com",
  },
  {
    name: "Sebastián Arias",
    carrera: "Ing. Sistemas",
    initials: "SA",
    color: "#02093a",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
  },
  {
    name: "Natalia Gutiérrez",
    carrera: "Arquitectura",
    initials: "NG",
    color: "#ff8a3d",
    dark: true,
    github: "https://github.com",
  },
  {
    name: "Emilio Chávez",
    carrera: "Filosofía",
    initials: "EC",
    color: "#1a3aad",
    linkedin: "https://linkedin.com",
  },
];

export default function Members() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef    = useRef<HTMLDivElement>(null);
  const headRef    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(headRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: headRef.current, start: "top 82%" } }
      );
      gsap.fromTo(
        gridRef.current?.children ? Array.from(gridRef.current.children) : [],
        { opacity: 0, y: 28, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.65, stagger: 0.05,
          ease: "power3.out",
          scrollTrigger: { trigger: gridRef.current, start: "top 82%" } }
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
        {/* Header */}
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
              148 miembros activos en 9 carreras. Conectate con la comunidad.
            </p>
          </div>
        </div>

        {/* Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          {MEMBERS.map((m) => (
            <TiltCardGSAP
              key={m.name}
              intensity={9}
              shineColor="rgba(92,242,200,0.08)"
              className="flex flex-col items-center text-center gap-4 p-6 rounded-xl border border-white/[0.07] hover:border-white/[0.16] bg-white/[0.02] transition-colors"
            >
              {/* Avatar */}
              <Avatar
                name={m.name}
                initials={m.initials}
                color={m.color}
                dark={m.dark}
                image={m.image}
              />

              {/* Info */}
              <div className="flex-1 w-full">
                <p className="text-white text-[14px] font-semibold leading-snug mb-1">
                  {m.name}
                </p>
                <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-white/40">
                  {m.carrera}
                </p>
              </div>

              {/* Social links */}
              <SocialLinks name={m.name} github={m.github} linkedin={m.linkedin} />
            </TiltCardGSAP>
          ))}

          {/* +136 card */}
          <TiltCardGSAP
            intensity={9}
            shineColor="rgba(92,242,200,0.05)"
            className="flex flex-col items-center justify-center text-center gap-3 p-6 rounded-xl border border-white/[0.05] bg-white/[0.01] min-h-[180px]"
          >
            <div className="w-16 h-16 rounded-full border-2 border-dashed border-white/[0.15] flex items-center justify-center font-semibold text-white/30 text-sm">
              +136
            </div>
            <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-white/25">
              Más builders
            </p>
          </TiltCardGSAP>
        </div>
      </div>
    </section>
  );
}
