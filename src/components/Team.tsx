"use client";
/** @jsxRuntime classic */
import React, { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import TiltCardGSAP from "./TiltCardGSAP";
import { Avatar, SocialLinks } from "./SocialIcons";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

type Lead = {
  name: string;
  role: string;
  initials: string;
  color: string;
  dark?: boolean;
  image?: string;
  github?: string;
  linkedin?: string;
};

// ─── Edit this list to update the organizing team ───────────────────────────
const TEAM: Lead[] = [
  {
    name: "Gabriel Olarte Medrano",
    role: "Líder · Leader",
    initials: "GO",
    color: "#06175D",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
  },
  {
    name: "Wara Yaretzy",
    role: "Social Media Manager",
    initials: "WY",
    color: "#1ed4a2",
    dark: true,
    github: "https://github.com",
    linkedin: "https://linkedin.com",
  },
  {
    name: "Bernardo Perez",
    role: "Líder Técnico · Technical Lead",
    initials: "BP",
    color: "#1a3aad",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
  },
  {
    name: "Jose Cisternas",
    role: "Soporte IT · IT Support",
    initials: "JC",
    color: "#0fa37c",
    dark: true,
    github: "https://github.com",
    linkedin: "https://linkedin.com",
  },
  {
    name: "Gabriel Prado",
    role: "Coordinador de Eventos · Event Coordinator",
    initials: "GP",
    color: "#ff8a3d",
    dark: true,
    github: "https://github.com",
    linkedin: "https://linkedin.com",
  },
];

export default function Team() {
  const sectionRef = useRef<HTMLElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

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
        { opacity: 0, y: 28, scale: 0.96 },
        {
          opacity: 1, y: 0, scale: 1, duration: 0.65, stagger: 0.07,
          ease: "power3.out",
          scrollTrigger: { trigger: gridRef.current, start: "top 82%" },
        }
      );
      gsap.fromTo(
        ctaRef.current,
        { opacity: 0, y: 24 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: ctaRef.current, start: "top 88%" },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="equipo"
      ref={sectionRef}
      className="py-24 bg-navy-900 dark:bg-ink-950 border-b border-white/[0.06]"
    >
      <div className="max-w-[1240px] mx-auto px-6 md:px-8">
        {/* Header */}
        <div ref={headRef} className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-12 mb-14">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/40">
              <span className="text-signal-600">●</span> 05 / Equipo
            </p>
          </div>
          <div>
            <h2
              className="text-[clamp(28px,4vw,44px)] font-semibold text-white mb-4 leading-[1.05]"
              style={{ letterSpacing: "-0.025em" }}
            >
              Quiénes lideran el grupo.
            </h2>
            <p className="text-[16px] text-white/50 leading-relaxed max-w-xl">
              El equipo organizador detrás de los eventos, los proyectos y la
              comunidad. Escribinos directo — siempre estamos buscando gente que
              quiera sumar.
            </p>
          </div>
        </div>

        {/* Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4"
        >
          {TEAM.map((m) => (
            <TiltCardGSAP
              key={m.name}
              intensity={9}
              shineColor="rgba(92,242,200,0.08)"
              className="flex flex-col items-center text-center gap-4 p-6 rounded-xl border border-white/[0.07] hover:border-white/[0.16] bg-white/[0.02] transition-colors"
            >
              <Avatar
                name={m.name}
                initials={m.initials}
                color={m.color}
                dark={m.dark}
                image={m.image}
              />
              <div className="flex-1 w-full">
                <p className="text-white text-[14px] font-semibold leading-snug mb-1">
                  {m.name}
                </p>
                <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-signal-500">
                  {m.role}
                </p>
              </div>
              <SocialLinks name={m.name} github={m.github} linkedin={m.linkedin} />
            </TiltCardGSAP>
          ))}
        </div>

        {/* CTA */}
        <div
          ref={ctaRef}
          className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-6 p-6 rounded-xl border border-white/[0.1] bg-white/[0.03]"
        >
          <div>
            <p className="font-semibold text-white text-[15px] mb-1">
              ¿Querés ayudar a construir el grupo?
            </p>
            <p className="text-sm text-white/55">
              Tenemos posiciones abiertas en el equipo organizador.
            </p>
          </div>
          <a
            href="#roles"
            className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium bg-signal-500 text-ink-950 hover:bg-signal-600 transition-colors"
          >
            Únete al equipo organizador →
          </a>
        </div>
      </div>
    </section>
  );
}
