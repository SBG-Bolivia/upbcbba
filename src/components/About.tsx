"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const PILLARS = [
  {
    icon: "{ }",
    title: "Build",
    desc: "Proyectos reales con stack moderno. De la idea al deploy.",
  },
  {
    icon: "//",
    title: "Learn",
    desc: "Workshops, talks y mentorías de la comunidad AWS.",
  },
  {
    icon: "→",
    title: "Ship",
    desc: "Demo nights cada dos semanas. Si funciona, lo mostramos.",
  },
];

const STATS = [
  { value: 148, label: "Miembros activos", suffix: "" },
  { value: 23, label: "Proyectos enviados", suffix: "'25–'26" },
  { value: 9, label: "Carreras", suffix: "" },
];

function AnimatedNumber({
  value,
  suffix,
  inView,
}: {
  value: number;
  suffix: string;
  inView: boolean;
}) {
  const numRef = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!inView || hasAnimated.current || !numRef.current) return;
    hasAnimated.current = true;

    gsap.fromTo(
      { val: 0 },
      { val: value, duration: 1.8, ease: "power2.out" },
      {
        onUpdate: function () {
          if (numRef.current) {
            numRef.current.textContent = Math.round(this.targets()[0].val).toString();
          }
        },
      }
    );
  }, [inView, value]);

  return (
    <span>
      <span ref={numRef}>0</span>
      {suffix && (
        <em className="not-italic font-mono text-[13px] font-normal text-ink-500 dark:text-ink-400 ml-1.5">
          {suffix}
        </em>
      )}
    </span>
  );
}

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const pillarsRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        textRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: textRef.current,
            start: "top 80%",
          },
        }
      );

      gsap.fromTo(
        pillarsRef.current?.children ? Array.from(pillarsRef.current.children) : [],
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: pillarsRef.current,
            start: "top 80%",
          },
        }
      );

      ScrollTrigger.create({
        trigger: statsRef.current,
        start: "top 75%",
        onEnter: () => setInView(true),
      });

      gsap.fromTo(
        statsRef.current?.children ? Array.from(statsRef.current.children) : [],
        { opacity: 0, y: 32 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: statsRef.current,
            start: "top 75%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="nosotros"
      ref={sectionRef}
      className="py-24 bg-paper dark:bg-ink-950 border-b border-ink-100 dark:border-ink-800/40"
    >
      <div className="max-w-[1240px] mx-auto px-6 md:px-8">
        {/* Section header */}
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-12 mb-14">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-400 dark:text-ink-500">
              <span className="text-signal-700">●</span> 01 / Nosotros
            </p>
          </div>
          <div ref={textRef}>
            <h2
              className="text-[clamp(28px,4vw,44px)] font-semibold text-ink-900 dark:text-ink-050 mb-4 leading-[1.05]"
              style={{ letterSpacing: "-0.025em" }}
            >
              Hacemos cosas reales. Juntos.
            </h2>
            <p className="text-[16px] text-ink-500 dark:text-ink-400 leading-relaxed max-w-xl">
              Somos el grupo oficial de AWS en la UPB Cochabamba. Cualquiera que
              quiera construir algo — diseñadores, devs, analistas, o estudiantes
              de filosofía — tiene un lugar aquí. La membresía es gratis. El
              trabajo, no.
            </p>
          </div>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Pillars */}
          <div ref={pillarsRef} className="grid gap-4">
            {PILLARS.map((p) => (
              <div
                key={p.title}
                className="flex gap-5 p-5 rounded-xl border border-ink-100 dark:border-ink-800/50 bg-white dark:bg-ink-900/50 hover:border-navy-200 dark:hover:border-navy-800 transition-colors"
              >
                <div className="shrink-0 w-10 h-10 rounded-lg bg-navy-050 dark:bg-navy-900/60 flex items-center justify-center font-mono text-[13px] font-semibold text-navy-700 dark:text-signal-500">
                  {p.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-[15px] text-ink-900 dark:text-ink-050 mb-1">
                    {p.title}
                  </h3>
                  <p className="text-sm text-ink-500 dark:text-ink-400 leading-relaxed">
                    {p.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div ref={statsRef} className="grid gap-6">
            {STATS.map((s) => (
              <div
                key={s.label}
                className="px-6 py-5 rounded-xl border border-ink-100 dark:border-ink-800/50 bg-white dark:bg-ink-900/50"
              >
                <div
                  className="text-[clamp(36px,5vw,56px)] font-semibold text-navy-700 dark:text-signal-500 leading-none mb-2"
                  style={{ letterSpacing: "-0.02em" }}
                >
                  <AnimatedNumber
                    value={s.value}
                    suffix={s.suffix}
                    inView={inView}
                  />
                </div>
                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-500 dark:text-ink-400">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

