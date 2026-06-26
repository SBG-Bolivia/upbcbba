"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "@/lib/gsap";
import GalleryCarousel from "./GalleryCarousel";

const IMAGES = [
  "/events/comunidades/20260307_120634.jpg",
  "/events/comunidades/20260307_135833.jpg",
  "/events/comunidades/20260308_111854.jpg",
  "/events/comunidades/20260420_171424768.jpg",
  "/events/comunidades/VideoCapture_20260616-132430.jpg",
];

const TITLE = "Colaboración con otras comunidades.";

const DESCRIPTION =
  "AWS Student Builder Group Cochabamba mantiene una relación activa con distintas comunidades tecnológicas, promoviendo la colaboración, el aprendizaje compartido y la creación de espacios para el crecimiento profesional de estudiantes y desarrolladores. La participación conjunta en eventos, talleres y actividades comunitarias fortalece el ecosistema tecnológico local y permite generar oportunidades de aprendizaje de mayor impacto.";

function splitFirstParagraph(text: string): [string, string] {
  const idx = text.indexOf(". ");
  if (idx === -1) return [text, ""];
  return [text.slice(0, idx + 1), text.slice(idx + 2)];
}

export default function Comunidades() {
  const sectionRef = useRef<HTMLElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);

  const [firstP, rest] = splitFirstParagraph(DESCRIPTION);

  const toggleDesc = useCallback(() => {
    if (!descRef.current) return;
    if (!expanded) {
      gsap.fromTo(
        descRef.current,
        { height: 0, opacity: 0 },
        {
          height: "auto", opacity: 1, duration: 0.4, ease: "power2.out",
          onComplete: () => setExpanded(true),
        }
      );
    } else {
      gsap.to(descRef.current, {
        height: 0, opacity: 0, duration: 0.3, ease: "power2.in",
        onComplete: () => setExpanded(false),
      });
    }
  }, [expanded]);

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
        cardRef.current,
        { opacity: 0, x: 40 },
        {
          opacity: 1, x: 0, duration: 0.7, ease: "power3.out",
          scrollTrigger: { trigger: cardRef.current, start: "top 84%" },
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
              {TITLE}
            </h2>
            <p className="text-[16px] text-white/50 leading-relaxed max-w-xl">
              {firstP}
            </p>

            {rest && (
              <div
                ref={descRef}
                className="overflow-hidden"
                style={{ height: 0, opacity: 0 }}
              >
                <p className="text-[16px] text-white/50 leading-relaxed max-w-xl mt-2">
                  {rest}
                </p>
              </div>
            )}

            {rest && (
              <button
                onClick={toggleDesc}
                className="mt-3 font-mono text-[11px] uppercase tracking-[0.1em] text-signal-500 hover:text-signal-400 transition-colors"
              >
                {expanded ? "Mostrar menos" : "Leer más"}
              </button>
            )}
          </div>
        </div>

        <div ref={cardRef} className="max-w-[600px]">
          <GalleryCarousel images={IMAGES} title={TITLE} />
        </div>
      </div>
    </section>
  );
}
