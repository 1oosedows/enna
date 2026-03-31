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
          backgroundColor: "#0f1117",
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
            width: 1200,
            height: 4,
            background: "linear-gradient(90deg, #e63950, #d42040)",
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
            display: "flex",
          }}
        >
          ENNA
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 24,
            fontWeight: 500,
            color: "#e63950",
            letterSpacing: 8,
            marginBottom: 32,
            display: "flex",
          }}
        >
          OSINT &amp; RECON TOOL INDEX
        </div>

        {/* Divider */}
        <div
          style={{
            width: 300,
            height: 1,
            backgroundColor: "rgba(230,57,80,0.4)",
            marginBottom: 32,
          }}
        />

        {/* Description */}
        <div
          style={{
            fontSize: 18,
            color: "#9ca3af",
            marginBottom: 8,
            display: "flex",
          }}
        >
          Discover, compare, and deploy open-source security tools.
        </div>
        <div
          style={{
            fontSize: 18,
            color: "#9ca3af",
            marginBottom: 40,
            display: "flex",
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
            backgroundColor: "rgba(28,32,48,0.8)",
            border: "1px solid rgba(42,47,62,0.5)",
          }}
        >
          <div style={{ fontSize: 16, fontWeight: 600, color: "#e63950", display: "flex" }}>
            250+ Tools
          </div>
          <div
            style={{ width: 1, height: 24, backgroundColor: "rgba(42,47,62,0.8)" }}
          />
          <div style={{ fontSize: 16, fontWeight: 600, color: "#a855a0", display: "flex" }}>
            16 Categories
          </div>
          <div
            style={{ width: 1, height: 24, backgroundColor: "rgba(42,47,62,0.8)" }}
          />
          <div style={{ fontSize: 16, fontWeight: 600, color: "#9ca3af", display: "flex" }}>
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
            display: "flex",
          }}
        >
          www.en-na.com
        </div>
      </div>
    ),
    { ...size }
  );
}
