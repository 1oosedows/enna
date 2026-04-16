import { NextRequest, NextResponse } from "next/server";
import toolsData from "@/data/tools.json";
import { Tool, Category } from "@/types";

export const revalidate = 3600;

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const query = searchParams.get("q")?.toLowerCase();
  const category = searchParams.get("category") as Category | null;
  const language = searchParams.get("language")?.toLowerCase();
  const sort = searchParams.get("sort") || "name";
  const limit = Math.min(Number(searchParams.get("limit")) || 50, 100);
  const offset = Number(searchParams.get("offset")) || 0;

  let tools = toolsData as Tool[];

  if (category) {
    tools = tools.filter((t) => t.category === category);
  }

  if (language) {
    tools = tools.filter((t) => t.language.toLowerCase() === language);
  }

  if (query) {
    tools = tools.filter(
      (t) =>
        t.name.toLowerCase().includes(query) ||
        t.description.toLowerCase().includes(query) ||
        t.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  }

  if (sort === "stars") {
    tools = [...tools].sort((a, b) => (b.stars ?? 0) - (a.stars ?? 0));
  } else if (sort === "recent") {
    tools = [...tools].sort((a, b) => {
      if (!a.lastCommit) return 1;
      if (!b.lastCommit) return -1;
      return new Date(b.lastCommit).getTime() - new Date(a.lastCommit).getTime();
    });
  } else {
    tools = [...tools].sort((a, b) => a.name.localeCompare(b.name));
  }

  const total = tools.length;
  const paginated = tools.slice(offset, offset + limit);

  return NextResponse.json({
    tools: paginated,
    total,
    limit,
    offset,
  });
}
