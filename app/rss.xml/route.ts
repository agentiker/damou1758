import { publishedPosts, profile } from "@/lib/content";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://example.com";

function escape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function GET() {
  const posts = publishedPosts();
  const items = posts
    .map(
      (p) => `    <item>
      <title>${escape(p.title)}</title>
      <link>${SITE_URL}${p.permalink}</link>
      <guid>${SITE_URL}${p.permalink}</guid>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
      <category>${escape(p.category)}</category>
      <description>${escape(p.summary)}</description>
    </item>`
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escape(profile.name)}</title>
    <link>${SITE_URL}</link>
    <description>${escape(profile.bio)}</description>
    <language>zh-CN</language>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
