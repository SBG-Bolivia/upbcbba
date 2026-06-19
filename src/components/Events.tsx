"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";

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

export default function Events() {
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
          opacity: 1, y: 0, duration: 0.7, stagger: 0.15, ease: "power3.out",
          scrollTrigger: { trigger: listRef.current, start: "top 82%" },
        }
      );
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

        <div ref={listRef} className="flex flex-col gap-16">
          {EVENTS.map((ev) => (
            <div
              key={ev.title}
              className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8 pb-16 border-b border-white/[0.06] last:border-0 last:pb-0"
            >
              <div>
                <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-signal-500">
                  {ev.tag} · {ev.date}
                </span>
                <h3 className="text-[20px] font-semibold text-white mt-3 mb-3 leading-snug">
                  {ev.title}
                </h3>
                <p className="text-[14px] text-white/55 leading-relaxed">
                  {ev.desc}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {ev.images.map((src) => (
                  <GalleryTile key={src} src={src} alt={ev.title} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
