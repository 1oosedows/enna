import { MetadataRoute } from "next";
import toolsData from "@/data/tools.json";
import libraryData from "@/data/library.json";
import blogData from "@/data/blog.json";
import { categories } from "@/data/categories";
import { Tool } from "@/types";

const siteUrl = "https://www.en-na.com";

function getComparisonPairs(): string[] {
  const tools = toolsData as Tool[];
  const slugSet = new Set(tools.map((t) => t.slug));
  const pairs = new Set<string>();

  for (const tool of tools) {
    for (const alt of tool.alternatives || []) {
      if (slugSet.has(alt)) {
        const sorted = [tool.slug, alt].sort();
        pairs.add(`${sorted[0]}-vs-${sorted[1]}`);
      }
    }
  }
  return Array.from(pairs);
}

export default function sitemap(): MetadataRoute.Sitemap {
  const tools = (toolsData as Tool[]).map((tool) => ({
    url: `${siteUrl}/tool/${tool.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const categoryPages = categories.map((cat) => ({
    url: `${siteUrl}/category/${cat.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const comparisons = getComparisonPairs().map((slug) => ({
    url: `${siteUrl}/compare/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const books = libraryData.books.map((book) => ({
    url: `${siteUrl}/library/${book.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  const hardware = libraryData.hardware.map((item) => ({
    url: `${siteUrl}/gear/${item.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${siteUrl}/library`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/gear`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...blogData.posts.map((post) => ({
      url: `${siteUrl}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...categoryPages,
    ...tools,
    ...comparisons,
    ...books,
    ...hardware,
  ];
}
