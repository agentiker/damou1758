import Link from "next/link";
import NextImage from "next/image";
import type { Post } from "@/lib/content";
import { categoryByName } from "@/lib/categories";
import { formatDate } from "@/lib/utils";

export function PostCard({ post, index = 0 }: { post: Post; index?: number }) {
  const cat = categoryByName(post.category);
  const num = String(index + 1).padStart(2, "0");

  return (
    <Link href={post.permalink} className="group block">
      <article className="relative">
        {post.cover ? (
          <div className="relative aspect-[16/9] overflow-hidden bg-[var(--color-surface)]">
            <NextImage
              src={post.cover.src}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, 560px"
              placeholder="blur"
              blurDataURL={post.cover.blurDataURL}
              className="object-cover transition-all duration-700 group-hover:scale-[1.03] group-hover:opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg)] via-transparent to-transparent opacity-60" />
            <div className="absolute bottom-4 left-4">
              <span
                className="inline-block px-2 py-0.5 text-[0.65rem] font-medium tracking-[0.1em] uppercase"
                style={{
                  color: cat?.accent ?? "#c9a55a",
                  borderBottom: `1px solid ${cat?.accent ?? "#c9a55a"}`,
                }}
              >
                {post.category}
              </span>
            </div>
            <div className="absolute top-4 right-4 font-[var(--font-mono)] text-xs text-white/30">
              {num}
            </div>
          </div>
        ) : null}

        <div className="mt-4">
          <h3 className="font-[var(--font-display)] text-xl leading-snug text-[var(--color-text-bright)] transition-colors group-hover:text-[var(--color-gold)]">
            {post.title}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[var(--color-text-muted)]">
            {post.summary}
          </p>
          <div className="mt-3 flex items-center gap-3 text-xs text-[var(--color-text-muted)]">
            <time>{formatDate(post.date)}</time>
            <span className="text-[var(--color-border)]">·</span>
            <span>{post.metadata.readingTime} 分钟</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
