import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "ENNA — OSINT & Recon Tool Index";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0a0c14 0%, #0f1117 50%, #131620 100%)",
          fontFamily: "monospace",
          position: "relative",
        }}
      >
        {/* Top accent line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: "linear-gradient(90deg, #e63950, #d42040)",
          }}
        />

        {/* Grid overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(42,47,62,0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(42,47,62,0.25) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Glow */}
        <div
          style={{
            position: "absolute",
            top: 100,
            left: 200,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "rgba(230,57,80,0.08)",
            filter: "blur(80px)",
          }}
        />

        {/* Title */}
        <div
          style={{
            fontSize: 96,
            fontWeight: 700,
            color: "#e8eaed",
            letterSpacing: 20,
            marginBottom: 16,
          }}
        >
          ENNA
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 24,
            fontWeight: 500,
            background: "linear-gradient(90deg, #e63950, #d42040)",
            backgroundClip: "text",
            color: "#e63950",
            letterSpacing: 8,
            marginBottom: 32,
          }}
        >
          OSINT & RECON TOOL INDEX
        </div>

        {/* Divider */}
        <div
          style={{
            width: 300,
            height: 1,
            background: "rgba(230,57,80,0.4)",
            marginBottom: 32,
          }}
        />

        {/* Description */}
        <div
          style={{
            fontSize: 18,
            color: "#9ca3af",
            marginBottom: 8,
          }}
        >
          Discover, compare, and deploy open-source security tools.
        </div>
        <div
          style={{
            fontSize: 18,
            color: "#9ca3af",
            marginBottom: 40,
          }}
        >
          Curated directory with live GitHub stats.
        </div>

        {/* Stats bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 32,
            padding: "14px 40px",
            borderRadius: 8,
            background: "rgba(28,32,48,0.8)",
            border: "1px solid rgba(42,47,62,0.5)",
          }}
        >
          <div style={{ fontSize: 16, fontWeight: 600, color: "#e63950" }}>
            176+ Tools
          </div>
          <div
            style={{ width: 1, height: 24, background: "rgba(42,47,62,0.8)" }}
          />
          <div style={{ fontSize: 16, fontWeight: 600, color: "#a855a0" }}>
            14 Categories
          </div>
          <div
            style={{ width: 1, height: 24, background: "rgba(42,47,62,0.8)" }}
          />
          <div style={{ fontSize: 16, fontWeight: 600, color: "#9ca3af" }}>
            12 Languages
          </div>
        </div>

        {/* Domain */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            fontSize: 20,
            color: "rgba(230,57,80,0.6)",
            letterSpacing: 4,
          }}
        >
          www.en-na.com
        </div>
      </div>
    ),
    { ...size }
  );
}
