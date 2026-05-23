"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(barRef.current, {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: document.body,
          start: "top top",
          end: "bottom bottom",
          scrub: 0,
          onUpdate: (self) => {
            if (barRef.current) {
              barRef.current.style.transform = `scaleX(${self.progress})`;
            }
          },
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="fixed top-0 inset-x-0 z-[60] h-[2px] bg-transparent pointer-events-none">
      <div
        ref={barRef}
        className="h-full origin-left"
        style={{
          background:
            "linear-gradient(90deg, #1ed4a2 0%, #5cf2c8 60%, #a4fcdc 100%)",
          transform: "scaleX(0)",
          boxShadow: "0 0 8px rgba(92,242,200,0.6)",
        }}
      />
    </div>
  );
}
