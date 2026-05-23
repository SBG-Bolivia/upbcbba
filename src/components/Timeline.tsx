"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import ScrambleText from "./ScrambleText";

const MILESTONES = [
  {
    date: "MAR 2024",
    title: "Fundación",
    desc: "El grupo se funda con 8 miembros y una idea: construir cosas juntos en la UPB. Primera reunión en el Lab de Sistemas.",
    tag: "Inicio",
    color: "navy",
  },
  {
    date: "JUN 2024",
    title: "Primera Demo Night",
    desc: "Cuatro proyectos, una sala de clases, y más gente de la esperada. El formato funcionó desde el primer intento.",
    tag: "Comunidad",
    color: "signal",
  },
  {
    date: "SEP 2024",
    title: "Primer BuildWeekend",
    desc: "24 horas, tres equipos, dos proyectos que terminaron en producción con usuarios reales.",
    tag: "Hackathon",
    color: "plaza",
  },
  {
    date: "ENE 2025",
    title: "100 miembros",
    desc: "Cruzamos la barrera. Nueve carreras representadas, desde Sistemas hasta Filosofía.",
    tag: "Hito",
    color: "signal",
  },
  {
    date: "AGO 2025",
    title: "AWS Official Chapter",
    desc: "Reconocidos oficialmente como AWS Student Builder Group por Amazon Web Services.",
    tag: "AWS",
    color: "navy",
  },
  {
    date: "HOY",
    title: "148 builders activos",
    desc: "23 proyectos enviados, 9 carreras, Demo Night #07 en camino. Y esto recién empieza.",
    tag: "Activo",
    color: "signal",
    current: true,
  },
];

const tagCls = {
  navy:   "bg-navy-100 text-navy-600 dark:bg-navy-900/60 dark:text-navy-300",
  signal: "bg-signal-600/10 text-signal-700 dark:bg-signal-500/10 dark:text-signal-500",
  plaza:  "bg-plaza-500/10 text-plaza-600",
};

const dotCls = {
  navy:   "bg-navy-700 border-navy-300 dark:border-navy-600",
  signal: "bg-signal-600 border-signal-300 dark:border-signal-700",
  plaza:  "bg-plaza-500 border-plaza-500/40",
};

export default function Timeline() {
  const sectionRef = useRef<HTMLElement>(null);
  const headRef    = useRef<HTMLDivElement>(null);
  const itemsRef   = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(headRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: headRef.current, start: "top 82%" } }
      );

      itemsRef.current.filter(Boolean).forEach((el, i) => {
        gsap.fromTo(el,
          { opacity: 0, x: i % 2 === 0 ? -32 : 32 },
          { opacity: 1, x: 0, duration: 0.7, ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 84%" } }
        );
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-24 bg-navy-900 dark:bg-ink-950 border-b border-white/[0.06]"
    >
      <div className="max-w-[1240px] mx-auto px-6 md:px-8">

        {/* Header */}
        <div ref={headRef} className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-12 mb-16">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/40">
              <span className="text-signal-600">●</span> / Historia
            </p>
          </div>
          <div>
            <h2
              className="text-[clamp(28px,4vw,44px)] font-semibold text-white mb-4 leading-[1.05]"
              style={{ letterSpacing: "-0.025em" }}
            >
              <ScrambleText text="De 8 a 148, en un año." />
            </h2>
            <p className="text-[16px] text-white/50 leading-relaxed max-w-xl">
              No fue de golpe. Fue demo a demo, proyecto a proyecto.
            </p>
          </div>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[11px] md:left-1/2 top-0 bottom-0 w-px bg-white/[0.08] md:-translate-x-px" />

          <div className="flex flex-col gap-0">
            {MILESTONES.map((m, i) => {
              const isLeft = i % 2 === 0;
              return (
                <div
                  key={m.date}
                  ref={(el) => { itemsRef.current[i] = el; }}
                  className={`relative flex items-start gap-8 pb-10 ${
                    isLeft ? "md:flex-row" : "md:flex-row-reverse"
                  } flex-row`}
                >
                  {/* Dot */}
                  <div className={`absolute left-0 md:left-1/2 top-1 w-[23px] h-[23px] rounded-full border-4 border-navy-900 dark:border-ink-950 md:-translate-x-1/2 shrink-0 z-10 ${dotCls[m.color as keyof typeof dotCls]} ${m.current ? "ring-2 ring-signal-600/50 ring-offset-1 ring-offset-navy-900" : ""}`} />

                  {/* Spacer on desktop (pushes card to correct side) */}
                  <div className="hidden md:block md:w-1/2 shrink-0" />

                  {/* Card */}
                  <div className={`ml-10 md:ml-0 md:w-1/2 ${isLeft ? "md:pl-10" : "md:pr-10"}`}>
                    <div className={`p-5 rounded-xl border bg-white/[0.03] hover:bg-white/[0.06] transition-colors ${m.current ? "border-signal-600/25" : "border-white/[0.07]"}`}>
                      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/35">
                          {m.date}
                        </span>
                        <span className={`font-mono text-[9px] uppercase tracking-[0.1em] px-2 py-0.5 rounded-full ${tagCls[m.color as keyof typeof tagCls]}`}>
                          {m.tag}
                        </span>
                      </div>
                      <h3 className="text-[15px] font-semibold text-white mb-2">
                        {m.title}
                      </h3>
                      <p className="text-sm text-white/50 leading-relaxed">
                        {m.desc}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
