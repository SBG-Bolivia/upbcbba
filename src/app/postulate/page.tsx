import Link from "next/link";
import ApplicationForm from "./ApplicationForm";

export const metadata = {
  title: "Postulate · UPB Builders",
  description:
    "Postulate al equipo de UPB Builders. Contanos quién sos, qué equipo te interesa y subí tu CV.",
};

export default function PostulatePage() {
  return (
    <main
      className="min-h-screen py-20 px-6 text-white"
      style={{
        background:
          "radial-gradient(900px 500px at 80% -10%, rgba(92,242,200,.15), transparent 60%), linear-gradient(180deg, #02093a 0%, #06175d 100%)",
      }}
    >
      <div className="max-w-2xl mx-auto">
        <Link
          href="/#roles"
          className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/45 hover:text-white/80 transition-colors inline-flex items-center gap-2 mb-8"
        >
          ← Volver a los roles abiertos
        </Link>

        <h1
          className="text-[clamp(28px,4vw,40px)] font-semibold mb-3 leading-[1.05]"
          style={{ letterSpacing: "-0.025em" }}
        >
          Postulate al equipo.
        </h1>
        <p className="text-white/55 text-[15px] leading-relaxed mb-10 max-w-lg">
          Contanos quién sos, qué equipo te interesa y dejanos tu CV. Te
          escribimos por correo si encaja.
        </p>

        <ApplicationForm />
      </div>
    </main>
  );
}
