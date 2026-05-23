"use client";

import { useEffect, useRef, useState } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&";

interface Props {
  text: string;
  className?: string;
  delay?: number; // ms before scramble starts after intersection
}

export default function ScrambleText({ text, className, delay = 0 }: Props) {
  const [display, setDisplay] = useState(text);
  const spanRef  = useRef<HTMLSpanElement>(null);
  const doneRef  = useRef(false);

  useEffect(() => {
    const el = spanRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || doneRef.current) return;
        doneRef.current = true;
        observer.disconnect();

        const chars   = text.split("");
        const total   = chars.length * 5;
        let frame     = 0;

        const run = () => {
          const id = setInterval(() => {
            setDisplay(
              chars
                .map((ch, i) => {
                  if (ch === " " || ch === "." || ch === "," || ch === "—") return ch;
                  const resolve = Math.floor((i / chars.length) * total * 0.7);
                  if (frame >= resolve + 4) return ch;
                  return CHARS[Math.floor(Math.random() * CHARS.length)];
                })
                .join("")
            );
            frame++;
            if (frame > total) {
              clearInterval(id);
              setDisplay(text);
            }
          }, 26);
        };

        if (delay > 0) setTimeout(run, delay);
        else run();
      },
      { threshold: 0.25 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [text, delay]);

  return (
    <span ref={spanRef} className={className} aria-label={text}>
      {display}
    </span>
  );
}
