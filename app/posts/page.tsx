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
    <div className="mx-auto max-w-6xl px-6 lg:px-8 pt-16">
      <span className="section-label">ARCHIVE</span>
      <h1 className="mt-4 font-[var(--font-display)] text-3xl text-[var(--color-text-bright)] sm:text-4xl">
        全部文章
      </h1>
      <p className="mt-3 text-sm text-[var(--color-text-muted)]">共 {posts.length} 篇</p>

      <div className="mt-6 flex flex-wrap gap-3">
        {CATEGORIES.map((c) => (
          <Link
            key={c.slug}
            href={`/category/${c.slug}`}
            className="border border-[var(--color-border)] px-4 py-1.5 text-xs tracking-wide text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-gold-dim)] hover:text-[var(--color-gold)]"
          >
            {c.name}
          </Link>
        ))}
      </div>

      <div className="rule mt-8" />

      <div className="mt-12 grid gap-12 sm:grid-cols-2">
        {posts.map((post, i) => (
          <Reveal key={post.slug} delay={i * 0.05}>
            <PostCard post={post} index={i} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}
