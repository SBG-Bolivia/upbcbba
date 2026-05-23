"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

const EVENTS = [
  {
    tag: "/ Demo Night",
    date: "03 MAY 2026",
    title: "Demo Night #07",
    desc: "Once proyectos, dos horas, una sala. Trae tu laptop o trae solo curiosidad.",
    location: "Bloque C · UPB Cbba",
    time: "18:30",
    color: "signal" as const,
    featured: true,
  },
  {
    tag: "/ Workshop",
    date: "10 MAY 2026",
    title: "AWS Lambda desde cero",
    desc: "Aprende serverless con ejemplos reales. Trae laptop.",
    location: "Lab Sistemas · UPB",
    time: "17:00",
    color: "navy" as const,
  },
  {
    tag: "/ Hackathon",
    date: "24–25 MAY 2026",
    title: "BuildWeekend #03",
    desc: "48 horas para llevar una idea a un demo funcional. Equipos de 2–4.",
    location: "UPB Cochabamba",
    time: "Todo el día",
    color: "plaza" as const,
  },
  {
    tag: "/ Talk",
    date: "07 JUN 2026",
    title: "Arquitectura en AWS para estudiantes",
    desc: "De los 12 servicios que más se usan, cuáles son suficientes para el 90% de los proyectos.",
    location: "Online · Zoom",
    time: "19:00",
    color: "navy" as const,
  },
];

const colorMap = {
  signal: {
    tag: "text-signal-700 dark:text-signal-500",
    dot: "bg-signal-600",
    border: "border-signal-600/30 dark:border-signal-700/30",
    badge: "bg-signal-600/10 text-signal-700 dark:bg-signal-500/10 dark:text-signal-500",
  },
  navy: {
    tag: "text-navy-500 dark:text-navy-300",
    dot: "bg-navy-400",
    border: "border-navy-400/20 dark:border-navy-600/30",
    badge: "bg-navy-100 text-navy-600 dark:bg-navy-900/60 dark:text-navy-300",
  },
  plaza: {
    tag: "text-plaza-600",
    dot: "bg-plaza-500",
    border: "border-plaza-500/30",
    badge: "bg-plaza-500/10 text-plaza-600",
  },
};

export default function Events() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const featuredRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        featuredRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: featuredRef.current, start: "top 80%" },
        }
      );

      gsap.fromTo(
        cardsRef.current?.children ? Array.from(cardsRef.current.children) : [],
        { opacity: 0, y: 32 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: cardsRef.current, start: "top 80%" },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const featured = EVENTS[0];
  const rest = EVENTS.slice(1);

  return (
    <section
      id="eventos"
      ref={sectionRef}
      className="py-24 bg-navy-900 dark:bg-ink-950"
    >
      <div className="max-w-[1240px] mx-auto px-6 md:px-8">
        {/* Section header */}
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-12 mb-14">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/40">
              <span className="text-signal-600">●</span> 02 / Eventos
            </p>
          </div>
          <div>
            <h2
              className="text-[clamp(28px,4vw,44px)] font-semibold text-white mb-4 leading-[1.05]"
              style={{ letterSpacing: "-0.025em" }}
            >
              Próximas sesiones.
            </h2>
            <p className="text-[16px] text-white/50 leading-relaxed max-w-xl">
              Demo nights, workshops, hackathons. Todo gratis, todo en UPB Cbba
              — o en Zoom cuando no hay otra.
            </p>
          </div>
        </div>

        {/* Featured event */}
        <div
          ref={featuredRef}
          className="relative rounded-2xl overflow-hidden mb-6 border border-white/[0.08]"
          style={{ background: "#01051f" }}
        >
          {/* Grid bg */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(255,255,255,.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.03) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
          {/* Glow */}
          <div
            className="absolute top-0 right-0 w-96 h-48 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at top right, rgba(92,242,200,0.12), transparent 70%)",
            }}
          />

          <div className="relative p-8 md:p-10">
            <div className="flex justify-between items-start mb-8">
              <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-signal-500">
                {featured.tag} · {featured.date}
              </span>
              <span className="font-mono text-[11px] text-white/30 uppercase tracking-[0.1em]">
                cocha · 1840 m.s.n.m.
              </span>
            </div>
            <h3
              className="text-[clamp(24px,3.5vw,38px)] font-semibold text-white leading-[1.05] max-w-2xl mb-10"
              style={{ letterSpacing: "-0.025em" }}
            >
              {featured.title} — once proyectos, dos horas, una sala.
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-white/[0.1] pt-6">
              {[
                { label: "Miembros", value: "148", sub: "activos" },
                { label: "Proyectos", value: "11", sub: "esta noche" },
                { label: "Ubicación", value: "Bloque C", sub: featured.location.split("·")[0].trim() },
                { label: "Hora", value: featured.time, sub: featured.date },
              ].map((s) => (
                <div key={s.label}>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/40 mb-1.5">
                    {s.label}
                  </dt>
                  <dd className="text-[26px] font-semibold text-white leading-none m-0" style={{ letterSpacing: "-0.02em" }}>
                    {s.value}
                    <em className="not-italic font-mono text-[12px] font-normal text-white/40 ml-1.5">
                      {s.sub}
                    </em>
                  </dd>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Event cards grid */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {rest.map((ev) => {
            const c = colorMap[ev.color];
            return (
              <div
                key={ev.title}
                className={`rounded-xl border bg-white/[0.03] hover:bg-white/[0.06] transition-colors p-5 flex flex-col gap-3 ${c.border}`}
              >
                <div className="flex items-center justify-between">
                  <span className={`font-mono text-[10px] uppercase tracking-[0.14em] ${c.tag}`}>
                    {ev.tag}
                  </span>
                  <span
                    className={`font-mono text-[10px] px-2 py-0.5 rounded-full uppercase tracking-[0.08em] ${c.badge}`}
                  >
                    {ev.date}
                  </span>
                </div>
                <h4 className="text-[15px] font-semibold text-white leading-snug">
                  {ev.title}
                </h4>
                <p className="text-[13px] text-white/50 leading-relaxed flex-1">
                  {ev.desc}
                </p>
                <div className="flex items-center justify-between pt-2 border-t border-white/[0.08] font-mono text-[10px] uppercase tracking-[0.1em] text-white/40">
                  <span>{ev.location}</span>
                  <span>{ev.time}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
