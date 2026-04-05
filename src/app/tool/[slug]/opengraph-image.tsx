import { ImageResponse } from "next/og";
import toolsData from "@/data/tools.json";
import { categories } from "@/data/categories";
import { Tool } from "@/types";

export const runtime = "edge";
export const alt = "ENNA Tool";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tool = (toolsData as Tool[]).find((t) => t.slug === slug);

  if (!tool) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#0D1B24",
            color: "#e8eaed",
            fontSize: 48,
            fontFamily: "monospace",
          }}
        >
          Tool Not Found
        </div>
      ),
      { ...size }
    );
  }

  const category = categories.find((c) => c.id === tool.category);
  const tags = tool.tags.slice(0, 4);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#0D1B24",
          fontFamily: "monospace",
          position: "relative",
          padding: "60px 80px",
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

        {/* ENNA branding top-right */}
        <div
          style={{
            position: "absolute",
            top: 40,
            right: 80,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: "linear-gradient(135deg, #FF5A6E, #8DCAE8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: 14,
              fontWeight: 700,
            }}
          >
            EN
          </div>
          <div
            style={{
              fontSize: 20,
              fontWeight: 600,
              color: "#FF5A6E",
              letterSpacing: 2,
              display: "flex",
            }}
          >
            ENNA
          </div>
        </div>

        {/* Category badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <div
            style={{
              padding: "6px 16px",
              borderRadius: 6,
              background: "linear-gradient(135deg, #FF5A6E, #8DCAE8)",
              color: "white",
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: 2,
              textTransform: "uppercase",
              display: "flex",
            }}
          >
            {category?.name || tool.category}
          </div>
          <div
            style={{
              marginLeft: 16,
              fontSize: 16,
              color: "#8DCAE8",
              display: "flex",
            }}
          >
            {tool.language}
          </div>
        </div>

        {/* Tool name */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: "#e8eaed",
            lineHeight: 1.1,
            marginBottom: 16,
            display: "flex",
          }}
        >
          {tool.name}
        </div>

        {/* Description */}
        <div
          style={{
            fontSize: 22,
            color: "#8DCAE8",
            lineHeight: 1.5,
            marginBottom: 32,
            maxWidth: 900,
            display: "flex",
          }}
        >
          {tool.description.length > 120
            ? tool.description.substring(0, 120) + "..."
            : tool.description}
        </div>

        {/* Tags */}
        <div
          style={{
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          {tags.map((tag) => (
            <div
              key={tag}
              style={{
                padding: "6px 14px",
                borderRadius: 20,
                backgroundColor: "rgba(255, 90, 110, 0.12)",
                border: "1px solid rgba(255, 90, 110, 0.25)",
                color: "#FF5A6E",
                fontSize: 14,
                display: "flex",
              }}
            >
              {tag}
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            left: 80,
            right: 80,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 24,
            }}
          >
            {tool.platform.slice(0, 3).map((p) => (
              <div
                key={p}
                style={{
                  fontSize: 14,
                  color: "#4A8CAD",
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  display: "flex",
                }}
              >
                {p}
              </div>
            ))}
          </div>
          <div
            style={{
              fontSize: 18,
              color: "rgba(255,90,110,0.6)",
              letterSpacing: 3,
              display: "flex",
            }}
          >
            www.en-na.com
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
