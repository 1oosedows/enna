import { NextResponse } from "next/server";
import toolsData from "@/data/tools.json";
import { Tool } from "@/types";
import { formatStars } from "@/lib/github";

export const revalidate = 3600;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const tool = (toolsData as Tool[]).find((t) => t.slug === slug);

  if (!tool) {
    return new NextResponse("Not found", { status: 404 });
  }

  const stars = tool.stars !== undefined ? formatStars(tool.stars) : "—";
  const name = tool.name;
  const nameWidth = name.length * 7.5 + 20;
  const starsWidth = stars.length * 7 + 30;
  const totalWidth = nameWidth + starsWidth;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="20" role="img" aria-label="${name}: ${stars} stars">
  <title>${name}: ${stars} stars</title>
  <linearGradient id="s" x2="0" y2="100%">
    <stop offset="0" stop-color="#bbb" stop-opacity=".1"/>
    <stop offset="1" stop-opacity=".1"/>
  </linearGradient>
  <clipPath id="r">
    <rect width="${totalWidth}" height="20" rx="3" fill="#fff"/>
  </clipPath>
  <g clip-path="url(#r)">
    <rect width="${nameWidth}" height="20" fill="#1a1a2e"/>
    <rect x="${nameWidth}" width="${starsWidth}" height="20" fill="#e63950"/>
    <rect width="${totalWidth}" height="20" fill="url(#s)"/>
  </g>
  <g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="11">
    <text x="${nameWidth / 2}" y="14" fill="#fff">${escapeXml(name)}</text>
    <text x="${nameWidth + starsWidth / 2}" y="14" fill="#fff">★ ${escapeXml(stars)}</text>
  </g>
</svg>`;

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=3600",
    },
  });
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
