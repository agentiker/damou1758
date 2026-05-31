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
    <div className="mx-auto max-w-5xl px-5 pt-14">
      <Link
        href="/posts"
        className="inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" /> 全部文章
      </Link>

      <div className="mt-6 flex items-center gap-3">
        <span className="h-8 w-1.5 rounded-full" style={{ backgroundColor: category.accent }} />
        <h1 className="text-3xl font-extrabold text-white sm:text-4xl">{category.name}</h1>
      </div>
      <p className="mt-3 text-neutral-400">{category.description}</p>
      <p className="mt-1 text-sm text-neutral-600">共 {posts.length} 篇</p>

      {posts.length === 0 ? (
        <p className="mt-16 text-center text-neutral-500">这个主题还没有文章，敬请期待。</p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {posts.map((post, i) => (
            <Reveal key={post.slug} delay={i * 0.04}>
              <PostCard post={post} />
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
