import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "ENNA - OSINT & Recon Tool Index";
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
          backgroundColor: "#0D1B24",
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
            background: "linear-gradient(90deg, #FF5A6E, #8DCAE8)",
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
            color: "#FF5A6E",
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
            backgroundColor: "rgba(255,90,110,0.4)",
            marginBottom: 32,
          }}
        />

        {/* Description */}
        <div
          style={{
            fontSize: 18,
            color: "#8DCAE8",
            marginBottom: 8,
            display: "flex",
          }}
        >
          Discover, compare, and deploy open-source security tools.
        </div>
        <div
          style={{
            fontSize: 18,
            color: "#8DCAE8",
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
            backgroundColor: "rgba(14,27,36,0.8)",
            border: "1px solid rgba(30,58,74,0.5)",
          }}
        >
          <div style={{ fontSize: 16, fontWeight: 600, color: "#FF5A6E", display: "flex" }}>
            250+ Tools
          </div>
          <div
            style={{ width: 1, height: 24, backgroundColor: "rgba(30,58,74,0.8)" }}
          />
          <div style={{ fontSize: 16, fontWeight: 600, color: "#C4A0B9", display: "flex" }}>
            16 Categories
          </div>
          <div
            style={{ width: 1, height: 24, backgroundColor: "rgba(30,58,74,0.8)" }}
          />
          <div style={{ fontSize: 16, fontWeight: 600, color: "#8DCAE8", display: "flex" }}>
            12 Languages
          </div>
        </div>

        {/* Domain */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            fontSize: 20,
            color: "rgba(255,90,110,0.6)",
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
