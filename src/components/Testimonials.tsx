"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import ScrambleText from "./ScrambleText";

const QUOTES = [
  {
    quote:
      "Entré sin saber nada de cloud. Seis meses después tenía un proyecto con 200 usuarios corriendo en AWS Lambda. El grupo te empuja a terminar las cosas.",
    name: "Diego Mamani",
    carrera: "Ing. Civil · Sem. 4",
    initials: "DM",
    bg: "#1a3aad",
    light: false,
  },
  {
    quote:
      "Pensé que era solo para de Sistemas. Me equivoqué. Soy de Diseño y encontré el mejor equipo de toda mi carrera universitaria acá.",
    name: "Camila Rojas",
    carrera: "Diseño Gráfico · Sem. 6",
    initials: "CR",
    bg: "#0fa37c",
    light: true,
  },
  {
    quote:
      "El Demo Night te obliga a terminar las cosas. Es el mejor sistema de accountability que existe en la UPB. Punto.",
    name: "Valentina Cruz",
    carrera: "Ing. Sistemas · Sem. 5",
    initials: "VC",
    bg: "#06175D",
    light: false,
  },
  {
    quote:
      "Conseguí mi primer trabajo porque mostré ScheduleBot en un Demo Night. Alguien del público me contactó a la semana siguiente.",
    name: "Gabriel Soria",
    carrera: "Ing. Industrial · Sem. 7",
    initials: "GS",
    bg: "#0b2281",
    light: false,
  },
];

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const headRef    = useRef<HTMLDivElement>(null);
  const gridRef    = useRef<HTMLDivElement>(null);

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
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: "power3.out",
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

        {/* Header */}
        <div ref={headRef} className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-12 mb-16">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-400 dark:text-ink-500">
              <span className="text-signal-700">●</span> / Testimonios
            </p>
          </div>
          <div>
            <h2
              className="text-[clamp(28px,4vw,44px)] font-semibold text-ink-900 dark:text-ink-050 mb-4 leading-[1.05]"
              style={{ letterSpacing: "-0.025em" }}
            >
              <ScrambleText text="Lo que dicen los que ya están." />
            </h2>
            <p className="text-[16px] text-ink-500 dark:text-ink-400 leading-relaxed max-w-xl">
              No somos nosotros. Son ellos.
            </p>
          </div>
        </div>

        {/* Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
        >
          {QUOTES.map((q) => (
            <figure
              key={q.name}
              className="flex flex-col justify-between gap-6 p-6 md:p-7 rounded-xl border border-ink-100 dark:border-ink-800/50 bg-white dark:bg-ink-900/40 hover:border-navy-200 dark:hover:border-navy-700/50 transition-colors"
            >
              {/* Quote mark */}
              <div>
                <span
                  className="block font-serif text-[48px] leading-none mb-2 select-none"
                  style={{ color: "#5cf2c8", opacity: 0.4 }}
                  aria-hidden
                >
                  "
                </span>
                <blockquote className="text-[15px] text-ink-800 dark:text-ink-200 leading-relaxed">
                  {q.quote}
                </blockquote>
              </div>

              {/* Attribution */}
              <figcaption className="flex items-center gap-3 pt-4 border-t border-ink-100 dark:border-ink-800/50">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold shrink-0"
                  style={{
                    background: q.bg,
                    color: q.light ? "#060814" : "white",
                  }}
                >
                  {q.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink-900 dark:text-ink-050 leading-none mb-1">
                    {q.name}
                  </p>
                  <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-400 dark:text-ink-500">
                    {q.carrera}
                  </p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
