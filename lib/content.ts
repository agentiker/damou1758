import {
  posts as allPosts,
  profile,
  tools,
  roadmap,
  type Post,
  type Tool,
  type RoadmapStage,
} from "@/.velite";

export { profile, tools, roadmap };
export type { Post, Tool, RoadmapStage };
export {
  CATEGORIES,
  categoryBySlug,
  categoryByName,
  type CategoryName,
} from "@/lib/categories";

export function publishedPosts(): Post[] {
  return [...allPosts]
    .filter((p) => !p.draft)
    .sort((a, b) => +new Date(b.date) - +new Date(a.date));
}

export function postBySlug(slug: string): Post | undefined {
  return publishedPosts().find((p) => p.slug === slug);
}

export function postsByCategory(name: string): Post[] {
  return publishedPosts().filter((p) => p.category === name);
}

/** 精选文章：取最新 N 篇。 */
export function featuredPosts(n = 4): Post[] {
  return publishedPosts().slice(0, n);
}
