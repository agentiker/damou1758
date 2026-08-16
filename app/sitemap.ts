import type { MetadataRoute } from "next";
import { publishedPosts, CATEGORIES } from "@/lib/content";
import { allPlugins } from "@/lib/plugins";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://damou1758.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: now },
    { url: `${BASE}/posts`, lastModified: now },
    { url: `${BASE}/plugins`, lastModified: now },
    { url: `${BASE}/about`, lastModified: now },
  ];

  const posts: MetadataRoute.Sitemap = publishedPosts().map((p) => ({
    url: `${BASE}${p.permalink}`,
    lastModified: new Date(p.date),
  }));

  const categories: MetadataRoute.Sitemap = CATEGORIES.map((c) => ({
    url: `${BASE}/category/${c.slug}`,
    lastModified: now,
  }));

  const plugins: MetadataRoute.Sitemap = allPlugins().map((p) => ({
    url: `${BASE}${p.permalink}`,
    lastModified: now,
  }));

  return [...staticRoutes, ...posts, ...categories, ...plugins];
}
