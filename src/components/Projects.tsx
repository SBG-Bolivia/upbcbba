"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import TiltCardGSAP from "./TiltCardGSAP";

const PROJECTS = [
  {
    title: "Mercado UPB",
    version: "v0.4",
    desc: "Campus marketplace para libros y materiales. Construido en 6 semanas por tres estudiantes de Ing. de Sistemas.",
    tags: ["Next.js", "Supabase", "Tailwind"],
    builders: 3,
    users: 142,
    status: "shipping" as const,
  },
  {
    title: "ScheduleBot",
    version: "v1.1",
    desc: "Bot de Telegram que sincroniza los horarios de UPB y manda recordatorios antes de cada clase.",
    tags: ["Python", "AWS Lambda", "DynamoDB"],
    builders: 2,
    users: 310,
    status: "active" as const,
  },
  {
    title: "UPB Rides",
    version: "v0.2",
    desc: "App de carpooling para estudiantes. Coordina viajes entre zonas de Cochabamba usando geolocalización.",
    tags: ["React Native", "Node.js", "Maps API"],
    builders: 4,
    users: 55,
    status: "shipping" as const,
  },
];

const statusMap = {
  shipping: {
    label: "Shipping",
    class:
      "bg-signal-600/10 text-signal-700 dark:bg-signal-500/10 dark:text-signal-500",
  },
  active: {
    label: "Active",
    class: "bg-navy-100 text-navy-600 dark:bg-navy-900/60 dark:text-navy-300",
  },
};

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: headRef.current, start: "top 82%" },
        }
      );

      gsap.fromTo(
        cardsRef.current?.children ? Array.from(cardsRef.current.children) : [],
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.75,
          stagger: 0.13,
          ease: "power3.out",
          scrollTrigger: { trigger: cardsRef.current, start: "top 80%" },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="proyectos"
      ref={sectionRef}
      className="py-24 bg-paper dark:bg-ink-950 border-b border-ink-100 dark:border-ink-800/40"
    >
      <div className="max-w-[1240px] mx-auto px-6 md:px-8">
        {/* Section header */}
        <div
          ref={headRef}
          className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-12 mb-14"
        >
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-400 dark:text-ink-500">
              <span className="text-signal-700">●</span> 03 / Proyectos
            </p>
          </div>
          <div>
            <h2
              className="text-[clamp(28px,4vw,44px)] font-semibold text-ink-900 dark:text-ink-050 mb-4 leading-[1.05]"
              style={{ letterSpacing: "-0.025em" }}
            >
              Lo que ya se está enviando.
            </h2>
            <p className="text-[16px] text-ink-500 dark:text-ink-400 leading-relaxed max-w-xl">
              Proyectos reales hechos por estudiantes de la UPB. Stack moderno,
              usuarios reales, código en GitHub.
            </p>
          </div>
        </div>

        {/* Cards */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {PROJECTS.map((p) => {
            const s = statusMap[p.status];
            return (
              <TiltCardGSAP
                key={p.title}
                intensity={11}
                shineColor="rgba(26,58,173,0.13)"
                className="flex flex-col gap-4 p-5 rounded-xl border border-ink-100 dark:border-ink-800/50 bg-gradient-to-b from-white to-ink-050/50 dark:from-ink-900/70 dark:to-ink-900/40 hover:border-navy-200 dark:hover:border-navy-700/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <h3
                    className="text-[16px] font-semibold text-ink-900 dark:text-ink-050"
                    style={{ letterSpacing: "-0.01em" }}
                  >
                    {p.title}
                  </h3>
                  <span
                    className={`inline-flex items-center gap-1.5 font-mono text-[10px] px-2.5 py-1 rounded-full uppercase tracking-[0.06em] before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full before:bg-current ${s.class}`}
                  >
                    {p.version}
                  </span>
                </div>

                <p className="text-sm text-ink-600 dark:text-ink-400 leading-relaxed flex-1">
                  {p.desc}
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {p.tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-mono text-[10px] px-2 py-0.5 rounded-md bg-ink-100 dark:bg-ink-800/60 text-ink-600 dark:text-ink-400 uppercase tracking-[0.06em]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-dashed border-ink-200 dark:border-ink-700/50 font-mono text-[11px] text-ink-500 dark:text-ink-500 uppercase tracking-[0.1em]">
                  <span>{p.builders} · Builders</span>
                  <span className="text-navy-700 dark:text-navy-400">
                    {p.users} usuarios
                  </span>
                </div>
              </TiltCardGSAP>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-10 text-center">
          <a
            href="#"
            className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.1em] text-ink-500 dark:text-ink-400 hover:text-navy-700 dark:hover:text-signal-500 transition-colors"
          >
            Ver todos los proyectos
            <span>→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
