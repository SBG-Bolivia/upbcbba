"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import ThemeToggle from "./ThemeToggle";

const navLinks = [
  { label: "Nosotros",  href: "#nosotros" },
  { label: "Miembros",  href: "#miembros" },
  { label: "Eventos",   href: "#eventos" },
  { label: "Proyectos", href: "#proyectos" },
];

const SECTION_IDS = ["nosotros", "miembros", "eventos", "proyectos"];

export default function Navbar() {
  const [scrolled,       setScrolled]       = useState(false);
  const [menuOpen,       setMenuOpen]        = useState(false);
  const [activeSection,  setActiveSection]   = useState("");
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-35% 0px -60% 0px" }
    );
    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  // At the top the hero is always dark — force white text.
  // Once scrolled the bar gets a light/dark bg so use theme-aware colors.
  const brand   = scrolled ? "text-ink-900 dark:text-ink-050"  : "text-white";
  const sub     = scrolled ? "text-ink-400"                    : "text-white/50";
  const link    = scrolled
    ? "text-ink-600 dark:text-ink-400 hover:text-navy-700 dark:hover:text-signal-500"
    : "text-white/75 hover:text-white";
  const status  = scrolled ? "text-ink-500 dark:text-ink-500"  : "text-white/55";
  const kbdCls  = scrolled
    ? "border-ink-200 dark:border-ink-700 text-ink-400 dark:text-ink-500 bg-ink-050 dark:bg-ink-900 hover:border-navy-300 dark:hover:border-navy-600"
    : "border-white/20 text-white/50 bg-white/[0.06] hover:border-white/40";

  return (
    <header
      ref={navRef}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "backdrop-blur-md bg-paper/80 dark:bg-ink-950/80 border-b border-ink-100 dark:border-ink-800/50"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-[1240px] mx-auto px-6 md:px-8 h-14 flex items-center justify-between">
        {/* Brand */}
        <a href="#" className="flex items-center gap-2.5 shrink-0">
          <Image
            src="/aws-upb-logo.svg"
            alt="AWS UPB Builders"
            width={28}
            height={28}
            className="rounded"
          />
          <span
            className={`font-semibold text-sm leading-none transition-colors duration-300 ${brand}`}
            style={{ letterSpacing: "-0.01em" }}
          >
            AWS UPB Builders
            <span className={`font-normal transition-colors duration-300 ${sub}`}> / SBG</span>
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-7">
          {navLinks.map((l) => {
            const isActive = activeSection === l.href.slice(1);
            return (
              <a
                key={l.href}
                href={l.href}
                className={`relative font-mono text-[11px] uppercase tracking-[0.08em] transition-colors duration-300 ${link}`}
              >
                {l.label}
                {isActive && (
                  <span className="absolute -bottom-1 left-0 right-0 h-px bg-signal-500 rounded-full" />
                )}
              </a>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <div className={`hidden md:flex items-center gap-2 font-mono text-[11px] transition-colors duration-300 ${status}`}>
            <span className="w-[7px] h-[7px] rounded-full bg-signal-600 shadow-[0_0_0_3px_rgba(30,212,162,0.18)] inline-block" />
            v1.0 · activo
          </div>
          <kbd className={`hidden md:inline-flex items-center gap-1 px-2 py-1 rounded-md border font-mono text-[10px] cursor-pointer transition-colors duration-300 select-none ${kbdCls}`}>
            ⌘K
          </kbd>
          <ThemeToggle />
          <a
            href="#unete"
            className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-navy-700 text-white hover:bg-navy-800 transition-colors shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_1px_2px_rgba(6,23,93,0.2)]"
          >
            Únete
          </a>
          {/* Mobile menu button */}
          <button
            className={`md:hidden p-2 transition-colors duration-300 ${scrolled ? "text-ink-600 dark:text-ink-400" : "text-white/80"}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <span className="block w-5 h-0.5 bg-current mb-1" />
            <span className="block w-5 h-0.5 bg-current mb-1" />
            <span className="block w-3 h-0.5 bg-current" />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-ink-100 dark:border-ink-800/50 bg-paper/95 dark:bg-ink-950/95 backdrop-blur-md px-6 py-4 flex flex-col gap-4">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="font-mono text-[12px] uppercase tracking-[0.1em] text-ink-600 dark:text-ink-400 hover:text-navy-700 dark:hover:text-signal-500 transition-colors"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#unete"
            onClick={() => setMenuOpen(false)}
            className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg text-sm font-medium bg-navy-700 text-white hover:bg-navy-800 transition-colors"
          >
            Únete al grupo
          </a>
        </div>
      )}
    </header>
  );
}
