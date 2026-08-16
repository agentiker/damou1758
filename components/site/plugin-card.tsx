import Link from "next/link";
import { Star } from "lucide-react";
import type { Plugin } from "@/.velite";
import { pluginCategoryBySlug } from "@/lib/plugin-categories";
import { formatStars } from "@/lib/utils";

/**
 * 精选插件卡片：整卡链接到详情页 /plugins/<owner>/<repo>。
 * 纯展示组件（可在客户端筛选组件内渲染），只依赖 plugin-categories 配置。
 */
export function PluginCard({ plugin }: { plugin: Plugin }) {
  const cat = pluginCategoryBySlug(plugin.category);

  return (
    <Link
      href={plugin.permalink}
      className="group flex h-full flex-col border border-[var(--color-border)] bg-[var(--color-surface)] p-5 transition-colors hover:border-[var(--color-gold-dim)] hover:bg-[var(--color-surface-raised)]"
    >
      <div className="flex items-center justify-between gap-3">
        <span
          className="text-[0.6rem] font-medium tracking-[0.12em] uppercase"
          style={{ color: cat?.accent ?? "#c9a55a" }}
        >
          {cat?.name ?? plugin.category}
        </span>
        <span className="inline-flex items-center gap-1 font-[var(--font-mono)] text-[0.7rem] text-[var(--color-text-muted)]">
          <Star className="h-3 w-3" />
          {formatStars(plugin.stars ?? 0)}
        </span>
      </div>

      <h3 className="mt-3 font-[var(--font-display)] text-lg leading-snug text-[var(--color-text-bright)] transition-colors group-hover:text-[var(--color-gold)]">
        {plugin.name}
        {plugin.official ? (
          <span className="ml-2 align-middle font-[var(--font-mono)] text-[0.55rem] tracking-[0.1em] uppercase text-[var(--color-gold)]">
            官方
          </span>
        ) : null}
      </h3>

      <p className="mt-1 font-[var(--font-mono)] text-[0.7rem] text-[var(--color-text-muted)]">
        {plugin.owner}/{plugin.repo}
      </p>

      <p className="mt-3 flex-1 text-sm leading-relaxed text-[var(--color-text-muted)] line-clamp-3">
        {plugin.summary}
      </p>

      {plugin.tags && plugin.tags.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {plugin.tags.slice(0, 3).map((t) => (
            <span
              key={t}
              className="border border-[var(--color-border)] px-2 py-0.5 font-[var(--font-mono)] text-[0.6rem] tracking-[0.05em] text-[var(--color-text-muted)]"
            >
              {t}
            </span>
          ))}
        </div>
      ) : null}
    </Link>
  );
}
