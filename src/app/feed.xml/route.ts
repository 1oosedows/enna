import blogData from "@/data/blog.json";

export const revalidate = 3600;

export async function GET() {
  const posts = blogData.posts
    .slice()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const items = posts
    .map(
      (post) => `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>https://www.en-na.com/blog/${post.slug}</link>
      <guid>https://www.en-na.com/blog/${post.slug}</guid>
      <pubDate>${new Date(post.date + "T12:00:00Z").toUTCString()}</pubDate>
      <description>${escapeXml(post.excerpt)}</description>
    </item>`
    )
    .join("\n");

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>ENNA - OSINT &amp; Recon Tool Index</title>
    <link>https://www.en-na.com</link>
    <description>New tools, guides, and updates from ENNA</description>
    <language>en-us</language>
    <atom:link href="https://www.en-na.com/feed.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;

  return new Response(feed, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600",
    },
  });
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
