const ITEMS = [
  "AWS Student Builder Group",
  "UPB Cochabamba",
  "Demo Night #07",
  "React · Next.js · Tailwind",
  "Build in public",
  "Shipea algo este semestre",
  "1840 m.s.n.m.",
  "AWS Lambda · S3 · DynamoDB",
  "Gratis para estudiantes UPB",
  "Open to every carrera",
  "SBG / 2026",
  "Supabase · Vercel · GitHub",
];

function TickerContent() {
  return (
    <>
      {ITEMS.map((item, i) => (
        <span key={i} className="flex items-center gap-6 shrink-0">
          <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-600 dark:text-ink-400 whitespace-nowrap">
            {item}
          </span>
          <span className="w-1 h-1 rounded-full bg-signal-600 shrink-0" />
        </span>
      ))}
    </>
  );
}

export default function TickerStrip() {
  return (
    <div className="py-4 border-y border-ink-100 dark:border-ink-800/50 bg-ink-050/60 dark:bg-ink-900/40 overflow-hidden">
      <div
        className="flex gap-6"
        style={{
          animation: "ticker 40s linear infinite",
          width: "max-content",
        }}
      >
        <TickerContent />
        <TickerContent />
      </div>
      <style>{`
        @keyframes ticker {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
