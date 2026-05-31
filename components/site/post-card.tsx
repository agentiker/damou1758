import Link from "next/link";
import NextImage from "next/image";
import { CalendarDays, Clock } from "lucide-react";
import type { Post } from "@/lib/content";
import { categoryByName } from "@/lib/categories";
import { formatDate } from "@/lib/utils";

export function PostCard({ post }: { post: Post }) {
  const cat = categoryByName(post.category);
  return (
    <Link
      href={post.permalink}
      className="group flex flex-col overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] transition-colors hover:border-neutral-600"
    >
      {post.cover ? (
        <div className="relative aspect-[1200/630] overflow-hidden">
          <NextImage
            src={post.cover.src}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, 400px"
            placeholder="blur"
            blurDataURL={post.cover.blurDataURL}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      ) : null}
      <div className="flex flex-1 flex-col p-5">
        <span
          className="mb-2 inline-flex w-fit items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
          style={{
            color: cat?.accent ?? "#a5b4fc",
            backgroundColor: `${cat?.accent ?? "#6366f1"}1f`,
          }}
        >
          {post.category}
        </span>
        <h3 className="text-lg font-bold leading-snug text-white group-hover:text-gradient">
          {post.title}
        </h3>
        <p className="mt-2 line-clamp-2 flex-1 text-sm text-neutral-400">{post.summary}</p>
        <div className="mt-4 flex items-center gap-4 text-xs text-neutral-500">
          <span className="inline-flex items-center gap-1">
            <CalendarDays className="h-3.5 w-3.5" /> {formatDate(post.date)}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" /> {post.metadata.readingTime} 分钟
          </span>
        </div>
      </div>
    </Link>
  );
}
