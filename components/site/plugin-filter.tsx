"use client";

import { useState } from "react";
import type { Plugin } from "@/.velite";
import { PLUGIN_CATEGORIES } from "@/lib/plugin-categories";
import { cn } from "@/lib/utils";
import { PluginCard } from "./plugin-card";

const ALL = "all";

/**
 * 客户端分类筛选：数据经 props 传入，只引用纯配置 plugin-categories。
 * 不把 .velite 数据打进客户端 bundle。
 */
export function PluginFilter({ plugins }: { plugins: Plugin[] }) {
  const [active, setActive] = useState<string>(ALL);

  // 仅展示有内容的分类
  const cats = PLUGIN_CATEGORIES.filter((c) =>
    plugins.some((p) => p.category === c.slug)
  );
  const shown =
    active === ALL ? plugins : plugins.filter((p) => p.category === active);

  return (
    <>
      <div className="mt-6 flex flex-wrap gap-3">
        <FilterTab
          label={`全部 ${plugins.length}`}
          active={active === ALL}
          onClick={() => setActive(ALL)}
        />
        {cats.map((c) => (
          <FilterTab
            key={c.slug}
            label={c.name}
            accent={c.accent}
            active={active === c.slug}
            onClick={() => setActive(c.slug)}
          />
        ))}
      </div>

      <div className="rule mt-8" />

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((p) => (
          <PluginCard key={p.slug} plugin={p} />
        ))}
      </div>
    </>
  );
}

function FilterTab({
  label,
  active,
  accent,
  onClick,
}: {
  label: string;
  active: boolean;
  accent?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "border px-4 py-1.5 text-xs tracking-wide transition-colors",
        active
          ? "text-[var(--color-text-bright)]"
          : "border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-gold-dim)] hover:text-[var(--color-gold)]"
      )}
      style={
        active
          ? { borderColor: accent ?? "#c9a55a", color: accent ?? "#c9a55a" }
          : undefined
      }
    >
      {label}
    </button>
  );
}
