import type { Metadata } from "next";
import { getCertificate } from "@/lib/aws/repo";
import { getCertificateDownloadUrl } from "@/lib/aws/storage";

// Always rendered at request time — it reads from DynamoDB and presigns S3.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Verificación de certificado — AWS SBG UPB",
  robots: { index: false },
};

export default async function CertPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let cert = null;
  let error = false;
  try {
    cert = await getCertificate(id);
  } catch {
    // Backend not configured / unreachable. Show a soft error rather than 404.
    error = true;
  }

  let downloadUrl = "";
  if (cert && cert.status === "issued") {
    try {
      downloadUrl = await getCertificateDownloadUrl(cert.s3Key);
    } catch {
      downloadUrl = "";
    }
  }

  return (
    <main
      className="min-h-screen flex items-center justify-center px-6 py-20 text-white"
      style={{
        background:
          "radial-gradient(900px 500px at 80% -10%, rgba(92,242,200,.15), transparent 60%), linear-gradient(180deg, #02093a 0%, #06175d 100%)",
      }}
    >
      <div className="w-full max-w-lg rounded-2xl border border-white/[0.1] bg-white/[0.04] p-8 md:p-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/40 mb-6">
          <span className="text-signal-600">●</span> AWS SBG · Certificado
        </p>

        {error ? (
          <State
            tone="neutral"
            title="No se pudo verificar ahora"
            body="El servicio de certificados no está disponible en este momento. Intentá de nuevo más tarde."
          />
        ) : !cert ? (
          <State
            tone="error"
            title="Certificado no encontrado"
            body="Este enlace no corresponde a ningún certificado emitido. Verificá que esté completo y correcto."
          />
        ) : cert.status === "revoked" ? (
          <State
            tone="error"
            title="Certificado revocado"
            body="Este certificado fue revocado y ya no es válido."
          />
        ) : (
          <div>
            <div className="flex items-center gap-3 mb-7">
              <span className="w-10 h-10 rounded-full bg-signal-600/20 flex items-center justify-center text-signal-500 text-xl">
                ✓
              </span>
              <div>
                <p className="text-white font-semibold text-lg leading-tight">
                  Certificado verificado
                </p>
                <p className="text-white/45 text-sm">Emisión auténtica de AWS SBG UPB</p>
              </div>
            </div>

            <dl className="grid gap-4 border-t border-white/[0.1] pt-6">
              <Field label="Participante" value={cert.participantName} />
              <Field label="Evento" value={cert.eventName} />
              <Field
                label="Fecha de emisión"
                value={new Date(cert.issuedAt).toLocaleDateString("es-BO", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              />
              <Field label="ID" value={cert.certId} mono />
            </dl>

            {downloadUrl && (
              <a
                href={downloadUrl}
                className="mt-8 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium bg-signal-500 text-ink-950 hover:bg-signal-600 transition-colors"
              >
                Descargar certificado (PDF) →
              </a>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

function Field({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div>
      <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/40 mb-1">
        {label}
      </dt>
      <dd
        className={`text-white/90 m-0 ${mono ? "font-mono text-[12px] break-all text-white/60" : "text-[15px]"}`}
      >
        {value}
      </dd>
    </div>
  );
}

function State({
  tone,
  title,
  body,
}: {
  tone: "error" | "neutral";
  title: string;
  body: string;
}) {
  return (
    <div className="flex flex-col items-center text-center py-6">
      <span
        className={`w-12 h-12 rounded-full flex items-center justify-center text-xl mb-4 ${
          tone === "error"
            ? "bg-plaza-500/15 text-plaza-500"
            : "bg-white/10 text-white/60"
        }`}
      >
        {tone === "error" ? "✕" : "…"}
      </span>
      <h1 className="text-white font-semibold text-lg mb-2">{title}</h1>
      <p className="text-white/50 text-sm max-w-xs">{body}</p>
    </div>
  );
}
