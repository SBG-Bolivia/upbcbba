"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

const PERKS = [
  {
    icon: "☁️",
    title: "AWS Credits",
    desc: "Acceso a créditos de AWS para correr tus proyectos en la nube sin costo. Lambda, S3, RDS — lo que necesites para buildear.",
    tag: "Infraestructura",
    color: "navy",
  },
  {
    icon: "🎤",
    title: "Demo Nights",
    desc: "Mostrá lo que construiste cada dos semanas. Feedback real de pares y mentores, no de un tribunal.",
    tag: "Comunidad",
    color: "signal",
  },
  {
    icon: "🧠",
    title: "Workshops & Mentorías",
    desc: "Sesiones prácticas de AWS, diseño de sistemas, y carrera. Con gente que ya trabaja en la industria.",
    tag: "Aprendizaje",
    color: "navy",
  },
  {
    icon: "🤝",
    title: "Red de Contactos",
    desc: "Conectate con builders de todas las carreras. Encontrá co-founders, colaboradores, y amigos que también están haciendo cosas.",
    tag: "Network",
    color: "plaza",
  },
  {
    icon: "🏆",
    title: "Hackathons y Competencias",
    desc: "Participá en eventos regionales y globales con el respaldo del grupo — AWS GameDay, hackathons de IA, y más.",
    tag: "Competencia",
    color: "plaza",
  },
  {
    icon: "📄",
    title: "Certificaciones AWS",
    desc: "Material de estudio, grupos de preparación y acceso a vouchers de descuento para exámenes de certificación.",
    tag: "Carrera",
    color: "signal",
  },
];

const tagColors = {
  navy:   "bg-navy-100 text-navy-600 dark:bg-navy-900/60 dark:text-navy-300",
  signal: "bg-signal-600/10 text-signal-700 dark:bg-signal-500/10 dark:text-signal-500",
  plaza:  "bg-plaza-500/10 text-plaza-600 dark:bg-plaza-500/10 dark:text-plaza-500",
};

export default function Perks() {
  const sectionRef = useRef<HTMLElement>(null);
  const headRef   = useRef<HTMLDivElement>(null);
  const gridRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(headRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: headRef.current, start: "top 82%" } }
      );
      gsap.fromTo(
        gridRef.current?.children ? Array.from(gridRef.current.children) : [],
        { opacity: 0, y: 36 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: "power3.out",
          scrollTrigger: { trigger: gridRef.current, start: "top 80%" } }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-24 bg-paper dark:bg-ink-950 border-b border-ink-100 dark:border-ink-800/40"
    >
      <div className="max-w-[1240px] mx-auto px-6 md:px-8">

        {/* Section header */}
        <div ref={headRef} className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-12 mb-16">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-400 dark:text-ink-500">
              <span className="text-signal-700">●</span> / Beneficios
            </p>
          </div>
          <div>
            <h2
              className="text-[clamp(28px,4vw,44px)] font-semibold text-ink-900 dark:text-ink-050 mb-4 leading-[1.05]"
              style={{ letterSpacing: "-0.025em" }}
            >
              Por qué vale la pena unirse.
            </h2>
            <p className="text-[16px] text-ink-500 dark:text-ink-400 leading-relaxed max-w-xl">
              La membresía es gratis. Los beneficios, concretos. Acá lo que
              obtenés cuando entrás al grupo.
            </p>
          </div>
        </div>

        {/* Perks grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {PERKS.map((p) => (
            <div
              key={p.title}
              className="group relative flex flex-col gap-4 p-6 rounded-xl border border-ink-100 dark:border-ink-800/50 bg-white dark:bg-ink-900/40 hover:border-navy-200 dark:hover:border-navy-700/60 hover:shadow-md transition-all"
            >
              {/* Icon */}
              <div className="text-2xl w-10 h-10 flex items-center justify-center rounded-lg bg-ink-050 dark:bg-ink-800/50">
                {p.icon}
              </div>

              {/* Content */}
              <div className="flex flex-col gap-2 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <h3
                    className="text-[15px] font-semibold text-ink-900 dark:text-ink-050 leading-snug"
                    style={{ letterSpacing: "-0.01em" }}
                  >
                    {p.title}
                  </h3>
                  <span
                    className={`shrink-0 font-mono text-[9px] uppercase tracking-[0.1em] px-2 py-0.5 rounded-full ${tagColors[p.color as keyof typeof tagColors]}`}
                  >
                    {p.tag}
                  </span>
                </div>
                <p className="text-sm text-ink-500 dark:text-ink-400 leading-relaxed">
                  {p.desc}
                </p>
              </div>

              {/* Subtle hover accent line */}
              <div className="absolute bottom-0 inset-x-0 h-[2px] rounded-b-xl bg-gradient-to-r from-navy-700 to-signal-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-6 p-6 rounded-xl border border-navy-200 dark:border-navy-800/50 bg-navy-050 dark:bg-navy-900/20">
          <div>
            <p className="font-semibold text-ink-900 dark:text-ink-050 text-[15px] mb-1">
              Listo para empezar a buildear?
            </p>
            <p className="text-sm text-ink-500 dark:text-ink-400">
              Únete gratis, aparece al próximo Demo Night.
            </p>
          </div>
          <a
            href="#unete"
            className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium bg-navy-700 text-white hover:bg-navy-800 transition-colors shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]"
          >
            Únete al grupo →
          </a>
        </div>

      </div>
    </section>
  );
}
