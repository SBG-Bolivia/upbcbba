"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";

interface Props {
  children: React.ReactNode;
  className?: string;
  shineColor?: string; // e.g. "rgba(92,242,200,0.13)"
  intensity?: number;
}

/** Converts "rgba(r,g,b,a)" → "rgba(r,g,b,0)" so the gradient fades to
 *  the same hue fully transparent instead of blending through black. */
function toZeroAlpha(rgba: string): string {
  return rgba.replace(/,\s*[\d.]+\)$/, ", 0)");
}

export default function TiltCardGSAP({
  children,
  className = "",
  shineColor = "rgba(92,242,200,0.12)",
  intensity = 12,
}: Props) {
  const cardRef  = useRef<HTMLDivElement>(null);
  const shineRef = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x    = e.clientX - rect.left;
    const y    = e.clientY - rect.top;
    const xPct = (x / rect.width  - 0.5) * 2;
    const yPct = (y / rect.height - 0.5) * 2;

    gsap.to(el, {
      rotateY:              xPct * intensity,
      rotateX:              -yPct * (intensity * 0.7),
      scale:                1.025,
      transformPerspective: 900,
      duration:             0.25,
      ease:                 "power2.out",
      overwrite:            "auto",
    });

    if (shineRef.current) {
      gsap.to(shineRef.current, {
        opacity:   1,
        x:         `${xPct * 30}%`,
        y:         `${yPct * 30}%`,
        duration:  0.25,
        overwrite: "auto",
      });
    }
  };

  const onLeave = () => {
    const el = cardRef.current;
    if (!el) return;
    gsap.to(el, {
      rotateY: 0, rotateX: 0, scale: 1,
      duration: 0.55, ease: "power3.out", overwrite: "auto",
    });
    if (shineRef.current) {
      gsap.to(shineRef.current, { opacity: 0, duration: 0.3, overwrite: "auto" });
    }
  };

  const end = toZeroAlpha(shineColor);

  return (
    <div
      ref={cardRef}
      className={`relative ${className}`}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {children}
      <div
        ref={shineRef}
        aria-hidden
        className="absolute inset-0 pointer-events-none rounded-[inherit] opacity-0"
        style={{
          background: `radial-gradient(380px circle at 50% 50%, ${shineColor}, ${end} 68%)`,
        }}
      />
    </div>
  );
}
