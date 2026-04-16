import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 6,
          background: "linear-gradient(135deg, #0f1117, #1a1a2e)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "monospace",
          fontSize: 14,
          fontWeight: 700,
          position: "relative",
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, #FF5A6E, #8DCAE8)",
            backgroundClip: "text",
            color: "transparent",
            display: "flex",
            WebkitBackgroundClip: "text",
          }}
        >
          EN
        </div>
      </div>
    ),
    { ...size }
  );
}
