"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenisRef.current = lenis;

    // Keep ScrollTrigger in sync with Lenis' scroll position. Without this,
    // every scroll-reveal trigger evaluates against a stale position and they
    // all fire at once, and the smooth scroll can stall partway down the page.
    lenis.on("scroll", ScrollTrigger.update);

    // Drive Lenis from GSAP's ticker. Keep a named reference so we can remove
    // exactly this callback on cleanup (an inline arrow would never match).
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // Trigger positions depend on the final layout (fonts/images), so recompute
    // once everything has settled.
    const refreshId = window.setTimeout(() => ScrollTrigger.refresh(), 300);

    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLAnchorElement;
      if (target.tagName === "A" && target.hash) {
        const el = document.querySelector(target.hash);
        if (el) {
          e.preventDefault();
          lenis.scrollTo(el as HTMLElement, { offset: -64, duration: 1.4 });
        }
      }
    };

    document.addEventListener("click", handleAnchorClick);

    return () => {
      window.clearTimeout(refreshId);
      lenis.off("scroll", ScrollTrigger.update);
      gsap.ticker.remove(raf);
      document.removeEventListener("click", handleAnchorClick);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
