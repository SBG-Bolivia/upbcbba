"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

const WHATSAPP_URL = "https://chat.whatsapp.com/E3JGbxrbDYaICTwRpIN1Jz";
const CONTACT_EMAIL = "sbg@upb.edu";

const SOCIALS = [
  { label: "GitHub", href: "https://github.com" },
  { label: "Instagram", href: "https://instagram.com" },
  { label: "LinkedIn", href: "https://linkedin.com" },
];

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        innerRef.current,
        { opacity: 0, y: 32 },
        {
          opacity: 1, y: 0, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: innerRef.current, start: "top 84%" },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // Newsletter is a stub for now — wired to AWS SES in a later pass.
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
  };

  return (
    <section
      id="contacto"
      ref={sectionRef}
      className="py-24 bg-paper dark:bg-ink-950 border-b border-ink-100 dark:border-ink-800/40"
    >
      <div className="max-w-[1240px] mx-auto px-6 md:px-8">
        <div
          ref={innerRef}
          className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-12"
        >
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-400 dark:text-ink-500">
              <span className="text-signal-700">●</span> / Contacto
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Reach us */}
            <div>
              <h2
                className="text-[clamp(28px,4vw,40px)] font-semibold text-ink-900 dark:text-ink-050 mb-4 leading-[1.05]"
                style={{ letterSpacing: "-0.025em" }}
              >
                Hablemos.
              </h2>
              <p className="text-[16px] text-ink-500 dark:text-ink-400 leading-relaxed mb-6 max-w-md">
                ¿Tenés una idea, una propuesta o querés colaborar? La forma más
                rápida es el grupo de WhatsApp. También nos encontrás acá:
              </p>

              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="inline-block font-mono text-[13px] text-navy-700 dark:text-signal-500 hover:underline mb-6"
              >
                {CONTACT_EMAIL}
              </a>

              <div className="flex items-center gap-6 mb-8">
                {SOCIALS.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink-500 dark:text-ink-500 hover:text-navy-700 dark:hover:text-signal-500 transition-colors"
                  >
                    {s.label}
                  </a>
                ))}
              </div>

              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium bg-navy-700 text-white hover:bg-navy-800 transition-colors shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]"
              >
                Entrar al grupo de WhatsApp →
              </a>
            </div>

            {/* Newsletter */}
            <div className="rounded-2xl border border-ink-100 dark:border-ink-800/50 bg-white dark:bg-ink-900/40 p-7">
              <h3 className="text-[17px] font-semibold text-ink-900 dark:text-ink-050 mb-2">
                Newsletter del grupo
              </h3>
              <p className="text-sm text-ink-500 dark:text-ink-400 leading-relaxed mb-5">
                Un correo cada tanto con los próximos eventos y recursos. Sin spam.
              </p>

              {subscribed ? (
                <div className="flex items-center gap-3 py-3">
                  <span className="w-8 h-8 rounded-full bg-signal-600/15 flex items-center justify-center text-signal-700 dark:text-signal-500">
                    ✓
                  </span>
                  <p className="text-sm text-ink-600 dark:text-ink-300">
                    Anotado. Te escribimos pronto.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@upb.edu"
                    className="flex-1 bg-ink-050 dark:bg-ink-900 border border-ink-200 dark:border-ink-800 rounded-lg px-3 py-2.5 text-sm text-ink-900 dark:text-ink-050 placeholder:text-ink-400 focus:outline-none focus:border-signal-600/60 focus:ring-2 focus:ring-signal-600/20 transition-all"
                  />
                  <button
                    type="submit"
                    className="shrink-0 px-5 py-2.5 rounded-lg font-medium text-sm bg-signal-500 text-ink-950 hover:bg-signal-600 transition-colors"
                  >
                    Suscribirme
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
