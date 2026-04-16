import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          borderRadius: 36,
          background: "linear-gradient(135deg, #0f1117, #1a1a2e)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "monospace",
          fontSize: 80,
          fontWeight: 700,
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, #FF5A6E, #8DCAE8)",
            backgroundClip: "text",
            color: "transparent",
            display: "flex",
          }}
        >
          EN
        </div>
      </div>
    ),
    { ...size }
  );
}
