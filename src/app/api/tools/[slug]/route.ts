import { NextResponse } from "next/server";
import toolsData from "@/data/tools.json";
import { Tool } from "@/types";

export const revalidate = 3600;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const tool = (toolsData as Tool[]).find((t) => t.slug === slug);

  if (!tool) {
    return NextResponse.json({ error: "Tool not found" }, { status: 404 });
  }

  const alternatives = tool.alternatives
    ? (toolsData as Tool[])
        .filter((t) => tool.alternatives?.includes(t.slug))
        .map((t) => ({ slug: t.slug, name: t.name, category: t.category }))
    : [];

  return NextResponse.json({ ...tool, alternativeTools: alternatives });
}
