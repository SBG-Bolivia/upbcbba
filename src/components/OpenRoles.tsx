"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

const WHATSAPP_URL = "https://chat.whatsapp.com/E3JGbxrbDYaICTwRpIN1Jz";

// ─── Edit this list to update open positions ────────────────────────────────
const ROLES = [
  {
    title: "Desarrollador/a Frontend",
    desc: "Ayudá a construir el sitio, herramientas internas y proyectos de la comunidad con React y Next.js.",
    tag: "Dev",
    color: "navy",
  },
  {
    title: "Desarrollador/a Backend / Cloud",
    desc: "Trabajá con AWS — Lambda, DynamoDB, S3 — en la infra del grupo y el sistema de certificados.",
    tag: "Cloud",
    color: "signal",
  },
  {
    title: "Creador/a de Contenido",
    desc: "Diseño, video y posts para redes. Contá lo que construimos y hacé crecer la comunidad.",
    tag: "Contenido",
    color: "plaza",
  },
  {
    title: "Coordinador/a de Eventos",
    desc: "Logística de Demo Nights, workshops y hackathons. Que todo salga bien, de la idea al cierre.",
    tag: "Eventos",
    color: "navy",
  },
  {
    title: "Diseñador/a UI/UX",
    desc: "Identidad visual, materiales y experiencia del grupo. Hacé que todo se vea y se sienta bien.",
    tag: "Diseño",
    color: "signal",
  },
  {
    title: "Embajador/a de Comunidad",
    desc: "Conectá con otras carreras y universidades. Sumá builders y abrí puertas.",
    tag: "Comunidad",
    color: "plaza",
  },
];

const tagColors = {
  navy:   "bg-navy-100 text-navy-600 dark:bg-navy-900/60 dark:text-navy-300",
  signal: "bg-signal-600/10 text-signal-700 dark:bg-signal-500/10 dark:text-signal-500",
  plaza:  "bg-plaza-500/10 text-plaza-600 dark:bg-plaza-500/10 dark:text-plaza-500",
};

export default function OpenRoles() {
  const sectionRef = useRef<HTMLElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

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
        { opacity: 0, y: 36 },
        {
          opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: "power3.out",
          scrollTrigger: { trigger: gridRef.current, start: "top 80%" },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="roles"
      ref={sectionRef}
      className="py-24 bg-paper dark:bg-ink-950 border-b border-ink-100 dark:border-ink-800/40"
    >
      <div className="max-w-[1240px] mx-auto px-6 md:px-8">
        {/* Header */}
        <div ref={headRef} className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-12 mb-16">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-400 dark:text-ink-500">
              <span className="text-signal-700">●</span> / Súmate
            </p>
          </div>
          <div>
            <h2
              className="text-[clamp(28px,4vw,44px)] font-semibold text-ink-900 dark:text-ink-050 mb-4 leading-[1.05]"
              style={{ letterSpacing: "-0.025em" }}
            >
              Posiciones abiertas en el equipo.
            </h2>
            <p className="text-[16px] text-ink-500 dark:text-ink-400 leading-relaxed max-w-xl">
              No hace falta ser experto. Hace falta querer construir. Estos son
              los roles donde más nos vendría una mano ahora mismo.
            </p>
          </div>
        </div>

        {/* Roles grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {ROLES.map((r) => (
            <div
              key={r.title}
              className="group relative flex flex-col gap-3 p-6 rounded-xl border border-ink-100 dark:border-ink-800/50 bg-white dark:bg-ink-900/40 hover:border-navy-200 dark:hover:border-navy-700/60 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <h3
                  className="text-[15px] font-semibold text-ink-900 dark:text-ink-050 leading-snug"
                  style={{ letterSpacing: "-0.01em" }}
                >
                  {r.title}
                </h3>
                <span
                  className={`shrink-0 font-mono text-[9px] uppercase tracking-[0.1em] px-2 py-0.5 rounded-full ${tagColors[r.color as keyof typeof tagColors]}`}
                >
                  {r.tag}
                </span>
              </div>
              <p className="text-sm text-ink-500 dark:text-ink-400 leading-relaxed flex-1">
                {r.desc}
              </p>
              <div className="absolute bottom-0 inset-x-0 h-[2px] rounded-b-xl bg-gradient-to-r from-navy-700 to-signal-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-6 p-6 rounded-xl border border-navy-200 dark:border-navy-800/50 bg-navy-050 dark:bg-navy-900/20">
          <div>
            <p className="font-semibold text-ink-900 dark:text-ink-050 text-[15px] mb-1">
              ¿Te suena alguno?
            </p>
            <p className="text-sm text-ink-500 dark:text-ink-400">
              Escribinos por WhatsApp y contanos qué te gustaría hacer.
            </p>
          </div>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium bg-navy-700 text-white hover:bg-navy-800 transition-colors shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]"
          >
            Postúlate · Únete al equipo →
          </a>
        </div>
      </div>
    </section>
  );
}
