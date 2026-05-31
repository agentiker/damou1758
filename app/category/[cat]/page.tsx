import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PostCard } from "@/components/site/post-card";
import { Reveal } from "@/components/site/reveal";
import { CATEGORIES, categoryBySlug, postsByCategory } from "@/lib/content";

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ cat: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ cat: string }>;
}): Promise<Metadata> {
  const { cat } = await params;
  const category = categoryBySlug(cat);
  if (!category) return {};
  return { title: category.name, description: category.description };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ cat: string }>;
}) {
  const { cat } = await params;
  const category = categoryBySlug(cat);
  if (!category) notFound();

  const posts = postsByCategory(category.name);

  return (
    <div className="mx-auto max-w-6xl px-6 lg:px-8 pt-16">
      <Link
        href="/posts"
        className="inline-flex items-center gap-2 text-xs tracking-[0.1em] uppercase text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-gold)]"
      >
        <ArrowLeft className="h-3 w-3" /> 全部文章
      </Link>

      <div className="mt-8">
        <span className="section-label">DOMAIN</span>
        <h1 className="mt-4 font-[var(--font-display)] text-3xl text-[var(--color-text-bright)] sm:text-4xl">
          {category.name}
        </h1>
        <p className="mt-3 text-sm text-[var(--color-text-muted)]">{category.description}</p>
        <p className="mt-1 font-[var(--font-mono)] text-xs text-[var(--color-text-muted)]">
          {posts.length} 篇
        </p>
      </div>

      <div className="rule mt-8" />

      {posts.length === 0 ? (
        <p className="mt-20 text-center text-[var(--color-text-muted)]">
          这个主题还没有文章，敬请期待。
        </p>
      ) : (
        <div className="mt-12 grid gap-12 sm:grid-cols-2">
          {posts.map((post, i) => (
            <Reveal key={post.slug} delay={i * 0.05}>
              <PostCard post={post} index={i} />
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
