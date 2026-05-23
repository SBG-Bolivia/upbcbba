import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ background: "#01051f" }}
    >
      {/* Grid bg */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.025) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          WebkitMaskImage:
            "radial-gradient(ellipse at 50% 40%, black 30%, transparent 75%)",
          maskImage:
            "radial-gradient(ellipse at 50% 40%, black 30%, transparent 75%)",
        }}
      />

      <div className="relative flex flex-col items-center gap-8 text-center max-w-sm">
        <Image
          src="/aws-upb-logo.svg"
          alt="AWS UPB Builders"
          width={52}
          height={52}
          className="opacity-50"
        />

        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/30 mb-5">
            ERR_404 · Página no encontrada
          </p>
          <h1
            className="text-[clamp(80px,18vw,144px)] font-semibold leading-none mb-6 text-white"
            style={{
              letterSpacing: "-0.045em",
              background: "linear-gradient(180deg, white 40%, rgba(255,255,255,0.2) 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            404
          </h1>
          <p className="text-[15px] text-white/45 leading-relaxed">
            Esta página no existe o fue movida. Volvé al inicio y seguí buildeando.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium bg-signal-500 text-ink-950 hover:bg-signal-600 transition-colors"
          >
            ← Volver al inicio
          </Link>
          <Link
            href="/#unete"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium bg-white/[0.07] text-white hover:bg-white/[0.12] border border-white/[0.1] transition-colors"
          >
            Únete al grupo
          </Link>
        </div>

        <span className="font-mono text-[10px] text-white/20 uppercase tracking-[0.14em]">
          AWS UPB Builders · Cochabamba · 1840 m.s.n.m.
        </span>
      </div>
    </div>
  );
}
