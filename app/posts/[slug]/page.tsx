import type { Metadata } from "next";
import { notFound } from "next/navigation";
import NextImage from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { MDXContent } from "@/components/mdx/mdx-content";
import {
  publishedPosts,
  postBySlug,
  categoryByName,
} from "@/lib/content";
import { formatDate } from "@/lib/utils";

export function generateStaticParams() {
  return publishedPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = postBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      type: "article",
      images: post.cover ? [{ url: post.cover.src }] : undefined,
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = postBySlug(slug);
  if (!post) notFound();

  const cat = categoryByName(post.category);

  return (
    <article className="mx-auto max-w-3xl px-6 lg:px-8 pt-16 pb-20">
      {/* 面包屑 */}
      <Link
        href="/posts"
        className="inline-flex items-center gap-2 text-xs tracking-[0.1em] uppercase text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-gold)]"
      >
        <ArrowLeft className="h-3 w-3" /> 返回列表
      </Link>

      <header className="mt-10">
        <div className="flex items-center gap-3">
          <Link
            href={`/category/${cat?.slug ?? ""}`}
            className="text-xs tracking-[0.12em] uppercase transition-colors hover:text-[var(--color-text-bright)]"
            style={{ color: cat?.accent ?? "#c9a55a" }}
          >
            {post.category}
          </Link>
          <span className="text-[var(--color-border)]">·</span>
          <time className="text-xs text-[var(--color-text-muted)]">{formatDate(post.date)}</time>
          <span className="text-[var(--color-border)]">·</span>
          <span className="text-xs text-[var(--color-text-muted)]">{post.metadata.readingTime} 分钟</span>
        </div>

        <h1 className="mt-6 font-[var(--font-display)] text-3xl leading-[1.15] text-[var(--color-text-bright)] sm:text-5xl">
          {post.title}
        </h1>

        <p className="mt-5 text-lg leading-relaxed text-[var(--color-text-muted)]">
          {post.summary}
        </p>

        <div className="rule mt-8" />
      </header>

      {post.cover ? (
        <NextImage
          src={post.cover.src}
          alt={post.title}
          width={post.cover.width}
          height={post.cover.height}
          placeholder="blur"
          blurDataURL={post.cover.blurDataURL}
          priority
          className="mt-10 w-full border border-[var(--color-border)]"
        />
      ) : null}

      <div className="prose mt-12">
        <MDXContent code={post.content} />
      </div>

      {post.tags.length > 0 ? (
        <div className="mt-16 pt-8">
          <div className="rule mb-6" />
          <div className="flex flex-wrap gap-3">
            {post.tags.map((t) => (
              <span
                key={t}
                className="border border-[var(--color-border)] px-3 py-1 text-xs tracking-wide text-[var(--color-text-muted)]"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      ) : null}
    </article>
  );
}
