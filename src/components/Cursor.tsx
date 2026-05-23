"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

export default function Cursor() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(hover: none)").matches) return;

    const dot  = dotRef.current!;
    const ring = ringRef.current!;

    gsap.set([dot, ring], { xPercent: -50, yPercent: -50, opacity: 0 });

    const xDot  = gsap.quickTo(dot,  "x", { duration: 0.06 });
    const yDot  = gsap.quickTo(dot,  "y", { duration: 0.06 });
    const xRing = gsap.quickTo(ring, "x", { duration: 0.45, ease: "power3.out" });
    const yRing = gsap.quickTo(ring, "y", { duration: 0.45, ease: "power3.out" });

    let visible = false;

    const onMove = (e: MouseEvent) => {
      xDot(e.clientX); yDot(e.clientY);
      xRing(e.clientX); yRing(e.clientY);
      if (!visible) {
        visible = true;
        gsap.to([dot, ring], { opacity: 1, duration: 0.3 });
      }
    };

    const onEnter = () =>
      gsap.to(ring, { scale: 2.4, borderColor: "#5cf2c8", opacity: 0.55, duration: 0.22 });
    const onLeave = () =>
      gsap.to(ring, { scale: 1, borderColor: "rgba(92,242,200,0.35)", opacity: 1, duration: 0.22 });

    const bindHovers = () => {
      document
        .querySelectorAll("a, button, [role=button], input, select, textarea, label")
        .forEach((el) => {
          el.addEventListener("mouseenter", onEnter);
          el.addEventListener("mouseleave", onLeave);
        });
    };

    window.addEventListener("mousemove", onMove);
    bindHovers();
    document.documentElement.classList.add("cursor-none");

    const mo = new MutationObserver(bindHovers);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.documentElement.classList.remove("cursor-none");
      mo.disconnect();
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none w-[7px] h-[7px] rounded-full"
        style={{ background: "#5cf2c8" }}
      />
      <div
        ref={ringRef}
        className="fixed top-0 left-0 z-[9998] pointer-events-none w-8 h-8 rounded-full border-2"
        style={{ borderColor: "rgba(92,242,200,0.35)" }}
      />
    </>
  );
}
