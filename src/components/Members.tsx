"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import TiltCardGSAP from "./TiltCardGSAP";

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

function GitHubIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577v-2.165c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function Avatar({ member }: { member: Member }) {
  if (member.image) {
    return (
      <div className="relative w-16 h-16 rounded-full overflow-hidden ring-2 ring-white/10">
        <Image src={member.image} alt={member.name} fill className="object-cover" />
      </div>
    );
  }
  return (
    <div
      className="w-16 h-16 rounded-full flex items-center justify-center text-lg font-semibold ring-2 ring-white/10"
      style={{
        background: member.color,
        color: member.dark ? "#060814" : "white",
      }}
    >
      {member.initials}
    </div>
  );
}

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
              <Avatar member={m} />

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
              {(m.github || m.linkedin) && (
                <div className="flex items-center justify-center gap-3 pt-3 border-t border-white/[0.07] w-full">
                  {m.github && (
                    <a
                      href={m.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/35 hover:text-signal-500 transition-colors"
                      aria-label={`GitHub de ${m.name}`}
                    >
                      <GitHubIcon />
                    </a>
                  )}
                  {m.linkedin && (
                    <a
                      href={m.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/35 hover:text-signal-500 transition-colors"
                      aria-label={`LinkedIn de ${m.name}`}
                    >
                      <LinkedInIcon />
                    </a>
                  )}
                </div>
              )}
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
