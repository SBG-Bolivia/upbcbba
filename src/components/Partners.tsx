"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";

const PARTNERS = [
  { name: "Amazon Web Services", logo: "/aws-upb-logo.svg", width: 48 },
  { name: "UPB Cochabamba", label: "UPB", isText: true },
  { name: "GitHub Education", label: "GitHub", isText: true },
  { name: "Vercel", label: "Vercel", isText: true },
  { name: "Supabase", label: "Supabase", isText: true },
];

export default function Partners() {
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        rowRef.current?.children ? Array.from(rowRef.current.children) : [],
        { opacity: 0, y: 16 },
        {
          opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: "power3.out",
          scrollTrigger: { trigger: rowRef.current, start: "top 85%" },
        }
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="py-14 border-b border-ink-100 dark:border-ink-800/40 bg-paper dark:bg-ink-950">
      <div className="max-w-[1240px] mx-auto px-6 md:px-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-400 dark:text-ink-600 text-center mb-8">
          Partners &amp; comunidad
        </p>
        <div
          ref={rowRef}
          className="flex flex-wrap items-center justify-center gap-10 md:gap-16"
        >
          {PARTNERS.map((p) =>
            p.isText ? (
              <span
                key={p.name}
                className="font-semibold text-[18px] text-ink-300 dark:text-ink-700 tracking-tight select-none"
                style={{ letterSpacing: "-0.01em" }}
                title={p.name}
              >
                {p.label}
              </span>
            ) : (
              <div
                key={p.name}
                className="opacity-30 dark:opacity-20 hover:opacity-50 dark:hover:opacity-40 transition-opacity"
                title={p.name}
              >
                <Image
                  src={p.logo!}
                  alt={p.name}
                  width={p.width}
                  height={p.width}
                  className="object-contain"
                />
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
