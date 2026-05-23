"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const HEADLINE_WORDS = ["Construye", "el", "próximo", "Cochabamba,", "en", "código."];

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const wordsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const ledeRef = useRef<HTMLParagraphElement>(null);
  const ctasRef = useRef<HTMLDivElement>(null);
  const metaRef = useRef<HTMLDListElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        eyebrowRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.7 }
      )
        .fromTo(
          wordsRef.current.filter(Boolean),
          { opacity: 0, y: 32, rotateX: -20 },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 0.65,
            stagger: 0.07,
          },
          "-=0.3"
        )
        .fromTo(
          ledeRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.7 },
          "-=0.3"
        )
        .fromTo(
          ctasRef.current,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.6 },
          "-=0.4"
        )
        .fromTo(
          metaRef.current,
          { opacity: 0, x: 20 },
          { opacity: 1, x: 0, duration: 0.7 },
          "-=0.5"
        )
        .fromTo(
          logoRef.current,
          { opacity: 0, scale: 0.92 },
          { opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.4)" },
          0.2
        );

      // Subtle parallax on the grid bg
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => {
          const gridBg = sectionRef.current?.querySelector(".grid-bg");
          if (gridBg) gsap.set(gridBg, { y: self.progress * 60 });
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center overflow-hidden text-white"
      style={{
        background:
          "radial-gradient(900px 500px at 80% -10%, rgba(92,242,200,.15), transparent 60%), radial-gradient(700px 500px at 10% 120%, rgba(255,138,61,.08), transparent 60%), linear-gradient(180deg, #02093a 0%, #06175d 100%)",
      }}
    >
      {/* Grid background */}
      <div
        className="grid-bg absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.04) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          WebkitMaskImage:
            "radial-gradient(ellipse at 50% 30%, black 40%, transparent 80%)",
          maskImage:
            "radial-gradient(ellipse at 50% 30%, black 40%, transparent 80%)",
        }}
      />

      <div className="relative max-w-[1240px] mx-auto px-6 md:px-8 pt-24 pb-20 w-full grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-12 lg:gap-16 items-center">
        {/* Left column */}
        <div>
          <span
            ref={eyebrowRef}
            className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white/[0.06] border border-white/[0.12] font-mono text-[11px] uppercase tracking-[0.14em] text-white/78 mb-6"
          >
            <b className="text-signal-500 font-medium">AWS · SBG</b>
            <span className="text-white/40">/</span>
            2026 · Brand &amp; Community
          </span>

          <h1
            className="text-[clamp(42px,6vw,84px)] font-semibold leading-[0.97] mb-5 perspective-[800px]"
            style={{ letterSpacing: "-0.035em" }}
          >
            {HEADLINE_WORDS.map((word, i) => (
              <span
                key={i}
                ref={(el) => { wordsRef.current[i] = el; }}
                className="inline-block mr-[0.22em] last:mr-0"
              >
                {word === "Cochabamba," ? (
                  <em
                    className="not-italic"
                    style={{
                      background:
                        "linear-gradient(120deg, #5cf2c8 0%, #c8fde9 60%, white 100%)",
                      WebkitBackgroundClip: "text",
                      backgroundClip: "text",
                      color: "transparent",
                    }}
                  >
                    {word}
                  </em>
                ) : (
                  word
                )}
              </span>
            ))}
          </h1>

          <p
            ref={ledeRef}
            className="text-[17px] leading-relaxed text-white/70 max-w-[520px] mb-8"
          >
            AWS Student Builder Group en la Universidad Privada Boliviana,
            Cochabamba. Aquí se construyen proyectos reales, se aprende en
            comunidad y se shipea — con AWS y más allá.
          </p>

          <div ref={ctasRef} className="flex flex-wrap gap-3">
            <a
              href="#nosotros"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium bg-white text-navy-700 hover:bg-white/90 transition-colors shadow-lg"
            >
              Únete al grupo
              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-navy-100/20 border border-navy-200/30">
                ↵
              </span>
            </a>
            <a
              href="#proyectos"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium bg-white/[0.08] text-white hover:bg-white/[0.12] border border-white/[0.12] transition-colors"
            >
              Ver proyectos
            </a>
          </div>
        </div>

        {/* Right column — logo + meta */}
        <div className="flex flex-col gap-8 lg:gap-10">
          {/* Logo */}
          <div ref={logoRef} className="flex justify-center lg:justify-end">
            <div className="relative w-48 h-48 lg:w-56 lg:h-56">
              <div
                className="absolute inset-0 rounded-3xl"
                style={{
                  background:
                    "radial-gradient(circle, rgba(92,242,200,0.15) 0%, transparent 70%)",
                  filter: "blur(24px)",
                }}
              />
              <Image
                src="/aws-upb-logo.svg"
                alt="AWS Student Builder Group UPB"
                fill
                className="object-contain drop-shadow-2xl"
                priority
              />
            </div>
          </div>

          {/* Meta block */}
          <dl
            ref={metaRef}
            className="border-l border-white/[0.14] pl-6 grid gap-4"
          >
            {[
              {
                label: "Institution",
                value: "Universidad Privada Boliviana · Cochabamba",
              },
              {
                label: "Maintainer",
                value: "Student Builder Group",
                sub: "v1.0.0",
              },
            ].map(({ label, value, sub }) => (
              <div key={label}>
                <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/46 mb-1">
                  {label}
                </dt>
                <dd className="text-sm text-white/90 m-0">
                  {value}
                  {sub && (
                    <span className="font-mono text-signal-500 ml-2">
                      · {sub}
                    </span>
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 inset-x-0 h-24 pointer-events-none bg-gradient-to-t from-paper/10 to-transparent" />
    </section>
  );
}
