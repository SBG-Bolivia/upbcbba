"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";

export default function Intro() {
  const [show, setShow] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef      = useRef<HTMLDivElement>(null);
  const lineRef      = useRef<HTMLDivElement>(null);
  const counterRef   = useRef<HTMLSpanElement>(null);
  const metaRef      = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (sessionStorage.getItem("intro-shown")) return;
    sessionStorage.setItem("intro-shown", "1");
    setShow(true);
  }, []);

  useEffect(() => {
    if (!show) return;

    document.body.style.overflow = "hidden";

    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = "";
        setShow(false);
      },
    });

    tl.fromTo(
      logoRef.current,
      { opacity: 0, scale: 0.82, y: 12 },
      { opacity: 1, scale: 1, y: 0, duration: 0.75, ease: "back.out(1.5)" }
    )
      .fromTo(
        metaRef.current,
        { opacity: 0, y: 6 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" },
        "-=0.3"
      )
      .fromTo(
        lineRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: 1.15, ease: "power2.inOut" },
        "-=0.4"
      )
      .to(
        { val: 0 },
        {
          val: 100,
          duration: 1.15,
          ease: "power2.inOut",
          onUpdate: function () {
            if (counterRef.current) {
              counterRef.current.textContent = Math.round(
                this.targets()[0].val
              )
                .toString()
                .padStart(3, "0");
            }
          },
        },
        "<"
      )
      .to({}, { duration: 0.2 })
      .to(containerRef.current, {
        yPercent: -100,
        duration: 0.65,
        ease: "power3.in",
      });

    return () => {
      tl.kill();
      document.body.style.overflow = "";
    };
  }, [show]);

  if (!show) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[200] flex items-center justify-center"
      style={{ background: "#01051f" }}
    >
      <div className="flex flex-col items-center gap-7">
        <div ref={logoRef}>
          <Image
            src="/aws-upb-logo.svg"
            alt="AWS UPB Builders"
            width={80}
            height={80}
          />
        </div>

        <div className="flex flex-col items-center gap-3">
          <p
            ref={metaRef}
            className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/35"
          >
            Student Builder Group · UPB Cbba
          </p>

          <div className="w-40 h-px bg-white/10 overflow-hidden">
            <div
              ref={lineRef}
              className="h-full origin-left"
              style={{
                background: "linear-gradient(90deg, #0fa37c, #5cf2c8)",
                transform: "scaleX(0)",
              }}
            />
          </div>

          <span
            ref={counterRef}
            className="font-mono text-[11px] tracking-[0.1em] text-white/20"
          >
            000
          </span>
        </div>
      </div>
    </div>
  );
}
