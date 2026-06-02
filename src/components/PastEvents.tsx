"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";

type PastEvent = {
  title: string;
  date: string;
  tag: string;
  desc: string;
  // Replace these with real photos under public/events/<slug>/.
  // Falls back to a placeholder tile when the array is empty.
  images: string[];
};

// ─── Edit this list to add past events + their galleries ────────────────────
const PAST_EVENTS: PastEvent[] = [
  {
    title: "Demo Night #06",
    date: "19 ABR 2026",
    tag: "/ Demo Night",
    desc: "Nueve equipos mostraron lo que venían construyendo. Desde una app de horarios UPB hasta un bot de IA para el comedor. Sala llena, pizza incluida.",
    images: [],
  },
  {
    title: "Workshop · Intro a AWS Cloud",
    date: "05 ABR 2026",
    tag: "/ Workshop",
    desc: "Primer contacto con la consola de AWS: S3, Lambda y cómo desplegar tu primer proyecto sin morir en el intento.",
    images: [],
  },
  {
    title: "BuildWeekend #02",
    date: "14–15 MAR 2026",
    tag: "/ Hackathon",
    desc: "48 horas, equipos de 2 a 4, una idea a demo funcional. El proyecto ganador hoy sigue en desarrollo dentro del grupo.",
    images: [],
  },
];

function GalleryTile({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative aspect-[4/3] rounded-lg overflow-hidden border border-white/[0.08] group">
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes="(max-width: 768px) 33vw, 200px"
      />
    </div>
  );
}

function PlaceholderTile() {
  return (
    <div className="aspect-[4/3] rounded-lg border border-dashed border-white/[0.12] bg-white/[0.02] flex items-center justify-center">
      <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-white/25">
        Foto
      </span>
    </div>
  );
}

export default function PastEvents() {
  const sectionRef = useRef<HTMLElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

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
        listRef.current?.children ? Array.from(listRef.current.children) : [],
        { opacity: 0, y: 32 },
        {
          opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: "power3.out",
          scrollTrigger: { trigger: listRef.current, start: "top 82%" },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="pasados"
      ref={sectionRef}
      className="py-24 bg-navy-900 dark:bg-ink-950 border-b border-white/[0.06]"
    >
      <div className="max-w-[1240px] mx-auto px-6 md:px-8">
        {/* Header */}
        <div ref={headRef} className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-12 mb-14">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/40">
              <span className="text-signal-600">●</span> / Pasados
            </p>
          </div>
          <div>
            <h2
              className="text-[clamp(28px,4vw,44px)] font-semibold text-white mb-4 leading-[1.05]"
              style={{ letterSpacing: "-0.025em" }}
            >
              Lo que ya construimos juntos.
            </h2>
            <p className="text-[16px] text-white/50 leading-relaxed max-w-xl">
              Una mirada a los eventos que ya pasaron. Cada Demo Night, workshop y
              hackathon dejó proyectos, fotos y gente nueva en la comunidad.
            </p>
          </div>
        </div>

        {/* Event blocks */}
        <div ref={listRef} className="flex flex-col gap-12">
          {PAST_EVENTS.map((ev) => (
            <div
              key={ev.title}
              className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8 pb-12 border-b border-white/[0.06] last:border-0 last:pb-0"
            >
              {/* Description */}
              <div>
                <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-signal-500">
                  {ev.tag} · {ev.date}
                </span>
                <h3 className="text-[20px] font-semibold text-white mt-3 mb-2 leading-snug">
                  {ev.title}
                </h3>
                <p className="text-[14px] text-white/55 leading-relaxed">
                  {ev.desc}
                </p>
              </div>

              {/* Gallery */}
              <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                {ev.images.length > 0
                  ? ev.images.map((src, i) => (
                      <GalleryTile key={src} src={src} alt={`${ev.title} — foto ${i + 1}`} />
                    ))
                  : Array.from({ length: 4 }).map((_, i) => <PlaceholderTile key={i} />)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
