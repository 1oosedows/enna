import { MetadataRoute } from "next";
import toolsData from "@/data/tools.json";
import libraryData from "@/data/library.json";
import { Tool } from "@/types";

const siteUrl = "https://www.en-na.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const tools = (toolsData as Tool[]).map((tool) => ({
    url: `${siteUrl}/tool/${tool.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const books = libraryData.books.map((book) => ({
    url: `${siteUrl}/library/${book.slug}`,
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
    ...tools,
    ...books,
  ];
}
