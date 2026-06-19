"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";

const IMAGES = [
  "/events/comunidades/20260307_120634.jpg",
  "/events/comunidades/20260307_135833.jpg",
  "/events/comunidades/20260308_111854.jpg",
  "/events/comunidades/20260420_171424768.jpg",
  "/events/comunidades/VideoCapture_20260616-132430.jpg",
];

function GalleryTile({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative aspect-[4/3] rounded-lg overflow-hidden border border-white/[0.08] group">
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes="(max-width: 768px) 50vw, 25vw"
      />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
    </div>
  );
}

export default function Comunidades() {
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
        { opacity: 0, y: 32 },
        {
          opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: "power3.out",
          scrollTrigger: { trigger: gridRef.current, start: "top 82%" },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="comunidades"
      ref={sectionRef}
      className="py-24 bg-navy-900 dark:bg-ink-950 border-b border-white/[0.06]"
    >
      <div className="max-w-[1240px] mx-auto px-6 md:px-8">
        <div ref={headRef} className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-12 mb-14">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/40">
              <span className="text-signal-600">●</span> / Comunidades
            </p>
          </div>
          <div>
            <h2
              className="text-[clamp(28px,4vw,44px)] font-semibold text-white mb-4 leading-[1.05]"
              style={{ letterSpacing: "-0.025em" }}
            >
              Colaboración con otras comunidades.
            </h2>
            <p className="text-[16px] text-white/50 leading-relaxed max-w-xl">
              AWS Student Builder Group Cochabamba mantiene una relación activa
              con distintas comunidades tecnológicas, promoviendo la colaboración,
              el aprendizaje compartido y la creación de espacios para el
              crecimiento profesional de estudiantes y desarrolladores. La
              participación conjunta en eventos, talleres y actividades
              comunitarias fortalece el ecosistema tecnológico local y permite
              generar oportunidades de aprendizaje de mayor impacto.
            </p>
          </div>
        </div>

        <div
          ref={gridRef}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3"
        >
          {IMAGES.map((src) => (
            <GalleryTile key={src} src={src} alt="Colaboración con comunidades tecnológicas" />
          ))}
        </div>
      </div>
    </section>
  );
}
