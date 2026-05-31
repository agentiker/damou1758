import type { Metadata } from "next";
import { notFound } from "next/navigation";
import NextImage from "next/image";
import Link from "next/link";
import { CalendarDays, Clock, ArrowLeft } from "lucide-react";
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
    <article className="mx-auto max-w-3xl px-5 pt-12 pb-10">
      <Link
        href="/posts"
        className="inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" /> 返回文章列表
      </Link>

      <header className="mt-6">
        <Link
          href={`/category/${cat?.slug ?? ""}`}
          className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium"
          style={{
            color: cat?.accent ?? "#a5b4fc",
            backgroundColor: `${cat?.accent ?? "#6366f1"}1f`,
          }}
        >
          {post.category}
        </Link>
        <h1 className="mt-4 text-3xl font-extrabold leading-tight text-white sm:text-4xl">
          {post.title}
        </h1>
        <p className="mt-4 text-lg text-neutral-400">{post.summary}</p>
        <div className="mt-5 flex items-center gap-4 text-sm text-neutral-500">
          <span className="inline-flex items-center gap-1">
            <CalendarDays className="h-4 w-4" /> {formatDate(post.date)}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-4 w-4" /> 约 {post.metadata.readingTime} 分钟
          </span>
        </div>
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
          className="mt-8 w-full rounded-2xl border border-[var(--color-border)]"
        />
      ) : null}

      <div className="prose mt-10">
        <MDXContent code={post.content} />
      </div>

      {post.tags.length > 0 ? (
        <div className="mt-12 flex flex-wrap gap-2 border-t border-[var(--color-border)] pt-6">
          {post.tags.map((t) => (
            <span
              key={t}
              className="rounded-full bg-white/5 px-3 py-1 text-sm text-neutral-400"
            >
              #{t}
            </span>
          ))}
        </div>
      ) : null}
    </article>
  );
}
