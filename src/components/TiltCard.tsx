"use client";

import { useRef } from "react";

interface Props {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  shineColor?: string;
  intensity?: number;
}

export default function TiltCard({
  children,
  className = "",
  style,
  shineColor = "rgba(92,242,200,0.10)",
  intensity = 6,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x  = ((e.clientX - rect.left)  / rect.width)  * 100;
    const y  = ((e.clientY - rect.top)   / rect.height) * 100;
    const rx = ((e.clientY - rect.top)   / rect.height - 0.5) * -intensity;
    const ry = ((e.clientX - rect.left)  / rect.width  - 0.5) *  intensity;
    el.style.setProperty("--mx", `${x}%`);
    el.style.setProperty("--my", `${y}%`);
    el.style.setProperty("--rx", `${rx}deg`);
    el.style.setProperty("--ry", `${ry}deg`);
    el.style.setProperty("--shine-opacity", "1");
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
    el.style.setProperty("--shine-opacity", "0");
  };

  return (
    <div
      ref={ref}
      className={`relative ${className}`}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={
        {
          ...style,
          transform:
            "perspective(1200px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg))",
          transition:
            "transform 0.4s cubic-bezier(0.22,1,0.36,1)",
        } as React.CSSProperties
      }
    >
      {children}

      {/* Shine — follows cursor, fully transparent when mouse is away */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none rounded-[inherit]"
        style={{
          background: `radial-gradient(380px circle at var(--mx, 50%) var(--my, 50%), ${shineColor}, transparent 65%)`,
          opacity: "var(--shine-opacity, 0)",
          transition: "opacity 0.35s ease",
        }}
      />
    </div>
  );
}
