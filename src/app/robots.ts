import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/_next/static/media/",
          "/_next/static/chunks/",
          "/monitoring",
          "/api/",
        ],
      },
    ],
    sitemap: "https://www.en-na.com/sitemap.xml",
  };
}
