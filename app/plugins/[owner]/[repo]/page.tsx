import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Star, Github } from "lucide-react";
import {
  allPlugins,
  pluginBySlug,
  pluginDocBySlug,
  pluginCategoryBySlug,
} from "@/lib/plugins";
import { formatStars } from "@/lib/utils";

export function generateStaticParams() {
  return allPlugins().map((p) => ({ owner: p.owner, repo: p.repo }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ owner: string; repo: string }>;
}): Promise<Metadata> {
  const { owner, repo } = await params;
  const plugin = pluginBySlug(
    decodeURIComponent(owner),
    decodeURIComponent(repo)
  );
  if (!plugin) return {};
  return {
    title: `${plugin.name} · DSH 插件`,
    description: plugin.summary,
    openGraph: {
      title: plugin.name,
      description: plugin.summary,
      type: "article",
    },
  };
}

export default async function PluginPage({
  params,
}: {
  params: Promise<{ owner: string; repo: string }>;
}) {
  const { owner, repo } = await params;
  const plugin = pluginBySlug(
    decodeURIComponent(owner),
    decodeURIComponent(repo)
  );
  if (!plugin) notFound();

  const doc = pluginDocBySlug(plugin.owner, plugin.repo);
  const cat = pluginCategoryBySlug(plugin.category);
  const shortSha = plugin.ref ? plugin.ref.slice(0, 7) : undefined;

  return (
    <article className="mx-auto max-w-3xl px-6 lg:px-8 pt-16 pb-20">
      {/* 面包屑 */}
      <Link
        href="/plugins"
        className="inline-flex items-center gap-2 text-xs tracking-[0.1em] uppercase text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-gold)]"
      >
        <ArrowLeft className="h-3 w-3" /> 全部插件
      </Link>

      <header className="mt-10">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[var(--color-text-muted)]">
          <span
            className="tracking-[0.12em] uppercase"
            style={{ color: cat?.accent ?? "#c9a55a" }}
          >
            {cat?.name ?? plugin.category}
          </span>
          <span className="text-[var(--color-border)]">·</span>
          <span className="inline-flex items-center gap-1 font-[var(--font-mono)]">
            <Star className="h-3 w-3" /> {formatStars(plugin.stars ?? 0)}
          </span>
          {plugin.version ? (
            <>
              <span className="text-[var(--color-border)]">·</span>
              <span className="font-[var(--font-mono)]">{plugin.version}</span>
            </>
          ) : null}
          {plugin.license ? (
            <>
              <span className="text-[var(--color-border)]">·</span>
              <span className="font-[var(--font-mono)]">{plugin.license}</span>
            </>
          ) : null}
        </div>

        <h1 className="mt-6 font-[var(--font-display)] text-3xl leading-[1.15] text-[var(--color-text-bright)] sm:text-4xl">
          {plugin.name}
        </h1>
        <p className="mt-2 font-[var(--font-mono)] text-sm text-[var(--color-text-muted)]">
          {plugin.owner}/{plugin.repo}
        </p>

        {/* 中文精选简介 */}
        <p className="mt-6 text-lg leading-relaxed text-[var(--color-text-muted)]">
          {plugin.note ?? plugin.summary}
        </p>

        {/* 外链 GitHub（安装说明以仓库为准） */}
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <a
            href={plugin.href}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 border border-[var(--color-gold-dim)] px-5 py-2.5 text-sm tracking-wide text-[var(--color-gold)] transition-all hover:bg-[var(--color-gold)]/10"
          >
            <Github className="h-4 w-4" /> 在 GitHub 打开
          </a>
          <span className="text-xs text-[var(--color-text-muted)]">
            安装方式以仓库 README 为准
          </span>
        </div>

        <div className="rule mt-10" />
      </header>

      {/* README（锁定 commit，编译期已 sanitize） */}
      {doc ? (
        <div
          className="prose mt-12"
          dangerouslySetInnerHTML={{ __html: doc.content }}
        />
      ) : (
        <p className="mt-12 text-sm text-[var(--color-text-muted)]">
          README 尚未同步。运行 <code>pnpm sync-plugins</code> 后即可显示。
        </p>
      )}

      {/* 署名 + 风险提示 */}
      <footer className="mt-16 pt-8">
        <div className="rule mb-6" />
        <p className="text-xs leading-relaxed text-[var(--color-text-muted)]">
          内容源自{" "}
          <a
            href={plugin.href}
            target="_blank"
            rel="noreferrer"
            className="text-[var(--color-gold)] hover:underline"
          >
            {plugin.owner}/{plugin.repo}
          </a>
          {shortSha ? (
            <>
              {" @ "}
              <a
                href={`${plugin.href}/tree/${plugin.ref}`}
                target="_blank"
                rel="noreferrer"
                className="font-[var(--font-mono)] text-[var(--color-gold)] hover:underline"
              >
                {shortSha}
              </a>
            </>
          ) : null}
          {plugin.license ? ` · 许可证 ${plugin.license}` : ""}。
        </p>
        <p className="mt-2 text-xs leading-relaxed text-[var(--color-text-muted)]">
          ⚠️ 安装第三方插件会在你的机器上运行其代码，可读取你的文件、使用你的凭据并访问网络。
          收录于此不等于安全审计——安装前请先查看源码，陌生插件建议在不含敏感凭据的环境里试用。
        </p>
      </footer>
    </article>
  );
}
