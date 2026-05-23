import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "AWS Student Builder Group — UPB Cochabamba";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px",
          background: "linear-gradient(135deg, #02093a 0%, #06175d 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Grid overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.04) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />

        {/* Top badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "8px 16px",
            borderRadius: 999,
            background: "rgba(255,255,255,0.07)",
            border: "1px solid rgba(255,255,255,0.12)",
            width: "fit-content",
            color: "rgba(255,255,255,0.7)",
            fontSize: 14,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          AWS · SBG / 2026
        </div>

        {/* Headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div
            style={{
              fontSize: 72,
              fontWeight: 700,
              lineHeight: 1,
              letterSpacing: "-0.035em",
              color: "white",
            }}
          >
            Construye el próximo{" "}
            <span style={{ color: "#5cf2c8" }}>Cochabamba,</span>
            {" "}en código.
          </div>
          <div
            style={{
              fontSize: 22,
              color: "rgba(255,255,255,0.55)",
              lineHeight: 1.5,
            }}
          >
            AWS Student Builder Group · Universidad Privada Boliviana · Cochabamba
          </div>
        </div>

        {/* Bottom row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, letterSpacing: "0.1em", textTransform: "uppercase" }}>
            upbbuilders.vercel.app
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              color: "#5cf2c8",
              fontSize: 13,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#1ed4a2" }} />
            v1.0 · activo
          </div>
        </div>
      </div>
    ),
    size
  );
}
