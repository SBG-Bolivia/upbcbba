import Image from "next/image";

const LINKS = [
  { label: "GitHub", href: "https://github.com" },
  { label: "Instagram", href: "https://instagram.com" },
  { label: "LinkedIn", href: "https://linkedin.com" },
];

export default function Footer() {
  return (
    <footer className="py-14 bg-paper dark:bg-ink-950 border-t border-ink-100 dark:border-ink-800/40">
      <div className="max-w-[1240px] mx-auto px-6 md:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <Image
            src="/aws-upb-logo.svg"
            alt="AWS UPB"
            width={22}
            height={22}
            className="rounded opacity-60"
          />
          <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-500 dark:text-ink-500">
            © 2026 · AWS UPB Builders · Cochabamba
          </span>
        </div>

        {/* Social links */}
        <div className="flex items-center gap-6">
          {LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink-500 dark:text-ink-500 hover:text-navy-700 dark:hover:text-signal-500 transition-colors"
            >
              {l.label}
            </a>
          ))}
        </div>

        {/* Version */}
        <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-400 dark:text-ink-600">
          Design System v1.0.0 · SBG
        </span>
      </div>
    </footer>
  );
}
