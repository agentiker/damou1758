import type { Metadata } from "next";
import Link from "next/link";
import { PostCard } from "@/components/site/post-card";
import { Reveal } from "@/components/site/reveal";
import { publishedPosts, CATEGORIES } from "@/lib/content";

export const metadata: Metadata = {
  title: "全部文章",
  description: "AI Coding、Agent Engineering、AI Workflow 的全部实战教程。",
};

export default function PostsPage() {
  const posts = publishedPosts();
  return (
    <div className="mx-auto max-w-5xl px-5 pt-14">
      <h1 className="text-3xl font-extrabold text-white sm:text-4xl">全部文章</h1>
      <p className="mt-3 text-neutral-400">共 {posts.length} 篇 · 按时间倒序</p>

      {/* 分类入口 */}
      <div className="mt-6 flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <Link
            key={c.slug}
            href={`/category/${c.slug}`}
            className="rounded-full border border-[var(--color-border)] px-4 py-1.5 text-sm text-neutral-300 hover:bg-white/5"
            style={{ borderColor: `${c.accent}55` }}
          >
            {c.name}
          </Link>
        ))}
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {posts.map((post, i) => (
          <Reveal key={post.slug} delay={i * 0.04}>
            <PostCard post={post} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}
