"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "@/lib/gsap";
import GalleryCarousel from "./GalleryCarousel";

type RealEvent = {
  title: string;
  date: string;
  tag: string;
  desc: string;
  images: string[];
};

const EVENTS: RealEvent[] = [
  {
    title: "MeetUp de Lanzamiento AWS Student Builder Group Cochabamba",
    date: "FEB 2026",
    tag: "/ Lanzamiento",
    desc: "Este evento marcó el lanzamiento oficial de AWS Student Builder Group Cochabamba. La actividad se realizó en los laboratorios de la Universidad Privada Boliviana (UPB) y reunió a estudiantes interesados en computación en la nube, desarrollo de software y tecnologías AWS. Durante la jornada se realizó una introducción al ecosistema AWS, presentando los conceptos fundamentales de computación en la nube y mostrando el potencial de las herramientas disponibles para estudiantes. Además, se desarrolló un taller práctico utilizando servicios fundamentales de AWS, incluyendo Amazon S3 y AWS Lambda, permitiendo a los participantes tener un primer contacto con la creación de soluciones serverless.",
    images: [
      "/events/meetup-launch/20260224_195945805.jpg",
      "/events/meetup-launch/20260304_212823213.jpg",
      "/events/meetup-launch/6-03-04_21-21-10-260.jpg",
      "/events/meetup-launch/IMG_20260224_143900.jpg",
      "/events/meetup-launch/IMG_20260224_143951.jpg",
      "/events/meetup-launch/IMG_20260224_144321.jpg",
      "/events/meetup-launch/IMG_20260224_144838.jpg",
      "/events/meetup-launch/IMG_20260224_144848.jpg",
      "/events/meetup-launch/IMG_20260224_144918(1).jpg",
      "/events/meetup-launch/IMG_20260224_151214.jpg",
    ],
  },
  {
    title: "Roadmap AWS para Estudiantes",
    date: "MAR–ABR 2026",
    tag: "/ Talleres",
    desc: "Esta serie de talleres fue diseñada para introducir a los miembros de la comunidad al ecosistema AWS de una manera más estructurada. Los participantes exploraron los principales servicios utilizados en entornos reales y conocieron rutas de aprendizaje recomendadas para diferentes perfiles tecnológicos, incluyendo desarrollo, arquitectura cloud y data. El objetivo principal fue brindar una guía clara para iniciar una carrera en tecnologías cloud y comprender cómo construir proyectos utilizando servicios de AWS.",
    images: [
      "/events/roadmap/20260312_201323.jpg",
      "/events/roadmap/20260312_213924.jpg",
      "/events/roadmap/20260323_203631.jpg",
      "/events/roadmap/20260409_203447.jpg",
      "/events/roadmap/VideoCapture_20260424-232615.jpg",
    ],
  },
  {
    title: "Lanzamiento Student Community Day Cochabamba",
    date: "JUN 2026",
    tag: "/ Comunidad",
    desc: "Durante este evento se realizó la presentación oficial del Student Community Day en Cochabamba. Los asistentes conocieron los objetivos de la iniciativa, las oportunidades de participación y el impacto que este tipo de actividades genera dentro del ecosistema tecnológico estudiantil. Como parte de la agenda se desarrolló un taller práctico de despliegue de aplicaciones utilizando AWS Amplify, mostrando cómo publicar aplicaciones modernas de forma rápida y escalable.",
    images: [
      "/events/lanzamiento-scd/20260608_195945.jpg",
      "/events/lanzamiento-scd/20260610_010743198.jpg",
      "/events/lanzamiento-scd/20260610_011249696.jpg",
      "/events/lanzamiento-scd/20260610_012827403.jpg",
      "/events/lanzamiento-scd/IMG-20260608-WA0008.jpg",
      "/events/lanzamiento-scd/Photo Album 1 - 00000024.jpg",
      "/events/lanzamiento-scd/Photo Album 1 - 00000037.jpg",
      "/events/lanzamiento-scd/Photo Album 1 - 00000042.jpg",
      "/events/lanzamiento-scd/Photo Album 1 - 00000057.jpg",
      "/events/lanzamiento-scd/VideoCapture_20260610-011428.jpg",
      "/events/lanzamiento-scd/VideoCapture_20260610-011511.jpg",
      "/events/lanzamiento-scd/VideoCapture_20260610-012945.jpg",
      "/events/lanzamiento-scd/VideoCapture_20260610-013223.jpg",
      "/events/lanzamiento-scd/VideoCapture_20260610-013425.jpg",
      "/events/lanzamiento-scd/VideoCapture_20260610-013444.jpg",
    ],
  },
];

function splitFirstParagraph(text: string): [string, string] {
  const idx = text.indexOf(". ");
  if (idx === -1) return [text, ""];
  return [text.slice(0, idx + 1), text.slice(idx + 2)];
}

const NODE_COLORS = [
  "bg-signal-600 border-signal-300 dark:border-signal-700",
  "bg-navy-700 border-navy-300 dark:border-navy-600",
  "bg-plaza-500 border-plaza-500/40",
];

function TimelineItem({
  ev,
  index,
}: {
  ev: RealEvent;
  index: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLDivElement>(null);

  const [firstP, rest] = splitFirstParagraph(ev.desc);
  const isLeft = index % 2 === 0;
  const nodeColor = NODE_COLORS[index % NODE_COLORS.length];

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

  const carouselImages = ev.images;

  return (
    <div
      ref={cardRef}
      className={`relative flex items-start gap-6 md:gap-10 pb-16 md:pb-20 ${
        isLeft ? "md:flex-row" : "md:flex-row-reverse"
      } flex-row`}
    >
      <div className="hidden md:block md:w-1/2 shrink-0" />

      <div
        className={`absolute left-[11px] md:left-1/2 top-2 w-[19px] h-[19px] rounded-full border-4 border-navy-900 dark:border-ink-950 md:-translate-x-1/2 shrink-0 z-10 ${nodeColor} ring-2 ring-signal-600/20 ring-offset-[3px] ring-offset-navy-900`}
      />

      <div
        className={`ml-10 md:ml-0 md:w-1/2 ${isLeft ? "md:pr-10" : "md:pl-10"}`}
      >
          <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-5 md:p-6 hover:border-white/[0.14] transition-colors flex flex-row gap-4 md:gap-6">
          <div className="w-1/2">
            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/35">
                {ev.date}
              </span>
              <span className="font-mono text-[9px] uppercase tracking-[0.1em] px-2 py-0.5 rounded-full bg-signal-600/10 text-signal-500">
                {ev.tag}
              </span>
            </div>

            <h3 className="text-[17px] md:text-[19px] font-semibold text-white mb-3 leading-snug">
              {ev.title}
            </h3>

            <p className="text-[13px] md:text-[14px] text-white/55 leading-relaxed">
              {firstP}
            </p>

            {rest && (
              <div
                ref={descRef}
                className="overflow-hidden"
                style={{ height: 0, opacity: 0 }}
              >
                <p className="text-[13px] md:text-[14px] text-white/55 leading-relaxed mt-2">
                  {rest}
                </p>
              </div>
            )}

            {rest && (
              <button
                onClick={toggleDesc}
                className="mt-2 font-mono text-[10px] uppercase tracking-[0.1em] text-signal-500 hover:text-signal-400 transition-colors"
              >
                {expanded ? "Mostrar menos" : "Leer más"}
              </button>
            )}
          </div>

          <div className="w-1/2">
            <GalleryCarousel images={carouselImages} title={ev.title} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Events() {
  const sectionRef = useRef<HTMLElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement>(null);

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

      if (itemsRef.current) {
        const children = Array.from(itemsRef.current.children);
        children.forEach((el, i) => {
          const isLeft = i % 2 === 0;
          gsap.fromTo(
            el,
            { opacity: 0, x: isLeft ? -40 : 40 },
            {
              opacity: 1, x: 0, duration: 0.7, ease: "power3.out",
              scrollTrigger: { trigger: el, start: "top 84%" },
            }
          );
        });
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="eventos"
      ref={sectionRef}
      className="py-24 bg-navy-900 dark:bg-ink-950"
    >
      <div className="max-w-[1240px] mx-auto px-6 md:px-8">
        <div ref={headRef} className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-12 mb-14">
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
              Nuestros Eventos.
            </h2>
            <p className="text-[16px] text-white/50 leading-relaxed max-w-xl">
              Actividades reales organizadas por AWS Student Builder Group
              Cochabamba. Talleres, meetups y lanzamientos que ya son parte de
              la comunidad.
            </p>
          </div>
        </div>

        <div className="relative">
          <div className="absolute left-[11px] md:left-1/2 top-0 bottom-0 w-px bg-white/[0.08] md:-translate-x-px" />

          <div ref={itemsRef} className="flex flex-col">
            {EVENTS.map((ev, i) => (
              <TimelineItem key={ev.title} ev={ev} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
