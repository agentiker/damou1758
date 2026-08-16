import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";
import { Hero } from "@/components/site/hero";
import { Reveal } from "@/components/site/reveal";
import { PostCard } from "@/components/site/post-card";
import { CategoryCard } from "@/components/site/category-card";
import { PluginCard } from "@/components/site/plugin-card";
import {
  profile,
  tools,
  roadmap,
  CATEGORIES,
  featuredPosts,
  postsByCategory,
} from "@/lib/content";
import { featuredPlugins } from "@/lib/plugins";

function SectionHeader({
  log,
  title,
  subtitle,
  href,
}: {
  log: string;
  title: string;
  subtitle?: string;
  href?: string;
}) {
  return (
    <div className="mb-12">
      <Reveal>
        <span className="section-label">{log}</span>
        <div className="mt-4 flex items-end justify-between gap-6">
          <h2 className="font-[var(--font-display)] text-3xl text-[var(--color-text-bright)] sm:text-4xl">
            {title}
          </h2>
          {href ? (
            <Link
              href={href}
              className="hidden shrink-0 items-center gap-1 text-xs tracking-[0.1em] uppercase text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-gold)] sm:inline-flex"
            >
              查看全部 <ArrowRight className="h-3 w-3" />
            </Link>
          ) : null}
        </div>
        {subtitle ? (
          <p className="mt-3 max-w-lg text-sm text-[var(--color-text-muted)]">{subtitle}</p>
        ) : null}
        <div className="rule mt-6" />
      </Reveal>
    </div>
  );
}

export default function HomePage() {
  const featured = featuredPosts(4);
  const featuredPluginList = featuredPlugins(6);

  return (
    <>
      <Hero
        name={profile.name}
        tagline={profile.tagline}
        bio={profile.bio}
        avatar={profile.avatar}
      />

      {/* 身份标签 */}
      <section className="mx-auto max-w-6xl px-6 lg:px-8 py-16">
        <Reveal>
          <div className="grid grid-cols-2 gap-px overflow-hidden border border-[var(--color-border)] sm:grid-cols-4">
            {profile.stats.map((s) => (
              <div key={s.label} className="bg-[var(--color-surface)] px-5 py-6 text-center">
                <div className="font-[var(--font-display)] text-lg text-[var(--color-text-bright)]">
                  {s.value}
                </div>
                <div className="mt-1 text-[0.65rem] tracking-[0.15em] uppercase text-[var(--color-text-muted)]">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* 精选文章 */}
      <section className="mx-auto max-w-6xl px-6 lg:px-8 pt-8">
        <SectionHeader
          log="LOG 002 · RECENT"
          title="最近记录"
          subtitle="从实战中来，到实战中去"
          href="/posts"
        />
        <div className="grid gap-10 sm:grid-cols-2">
          {featured.map((post, i) => (
            <Reveal key={post.slug} delay={i * 0.08}>
              <PostCard post={post} index={i} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* 三大主题 */}
      <section className="mx-auto max-w-6xl px-6 lg:px-8 pt-24">
        <SectionHeader
          log="LOG 003 · DOMAINS"
          title="三条主线"
          subtitle="每条线独立成体系，组合起来覆盖 AI 工程全链路"
        />
        <div>
          {CATEGORIES.map((c, i) => (
            <Reveal key={c.slug} delay={i * 0.06}>
              <CategoryCard category={c} count={postsByCategory(c.name).length} index={i} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* 精选工具 */}
      <section className="mx-auto max-w-6xl px-6 lg:px-8 pt-24">
        <SectionHeader
          log="LOG 004 · TOOLKIT"
          title="日常工具"
          subtitle="我每天在用的 AI 工具清单"
        />
        <div className="grid gap-px overflow-hidden border border-[var(--color-border)] sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.04}>
              <a
                href={t.href ?? "#"}
                target="_blank"
                rel="noreferrer"
                className="group flex h-full flex-col bg-[var(--color-surface)] p-5 transition-colors hover:bg-[var(--color-surface-raised)]"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-[var(--color-text-bright)] group-hover:text-[var(--color-gold)]">
                    {t.name}
                  </span>
                  {t.tag ? (
                    <span className="font-[var(--font-mono)] text-[0.6rem] tracking-[0.1em] uppercase text-[var(--color-text-muted)]">
                      {t.tag}
                    </span>
                  ) : null}
                </div>
                <p className="mt-2 flex-1 text-xs leading-relaxed text-[var(--color-text-muted)]">
                  {t.description}
                </p>
              </a>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 精选插件 */}
      <section className="mx-auto max-w-6xl px-6 lg:px-8 pt-24">
        <SectionHeader
          log="LOG 005 · PLUGINS"
          title="精选 DSH 插件"
          subtitle="DeepSeek Harness「一切皆插件」——挑几个真正好用的"
          href="/plugins"
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featuredPluginList.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.05}>
              <PluginCard plugin={p} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* 学习路线图 */}
      <section className="mx-auto max-w-6xl px-6 lg:px-8 pt-24">
        <SectionHeader
          log="LOG 006 · ROADMAP"
          title="学习路径"
          subtitle="从入门到自动化的三个阶段"
        />
        <div className="grid gap-8 sm:grid-cols-3">
          {roadmap.map((stage, i) => (
            <Reveal key={stage.stage} delay={i * 0.06}>
              <div className="relative pl-6 before:absolute before:left-0 before:top-0 before:h-full before:w-px before:bg-[var(--color-border)]">
                <span className="font-[var(--font-mono)] text-[0.65rem] tracking-[0.15em] text-[var(--color-gold-dim)]">
                  PHASE {stage.stage}
                </span>
                <h3 className="mt-2 font-[var(--font-display)] text-lg text-[var(--color-text-bright)]">
                  {stage.title}
                </h3>
                <ul className="mt-4 space-y-2.5">
                  {stage.items.map((it) => (
                    <li key={it} className="flex gap-3 text-sm text-[var(--color-text-muted)]">
                      <span className="mt-[0.45rem] h-1 w-1 shrink-0 rounded-full bg-[var(--color-gold-dim)]" />
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 联系 */}
      <section className="mx-auto max-w-6xl px-6 lg:px-8 pt-24">
        <Reveal>
          <div className="border border-[var(--color-border)] p-10 sm:p-14">
            <span className="section-label">LOG 007 · CONTACT</span>
            <h2 className="mt-4 font-[var(--font-display)] text-2xl text-[var(--color-text-bright)] sm:text-3xl">
              一起把一个人做成一支团队
            </h2>
            <p className="mt-4 max-w-lg text-sm text-[var(--color-text-muted)]">
              如果你也在做 AI 产品、搭 Agent、或设计自动化工作流——来聊聊。
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              {profile.email ? (
                <a
                  href={`mailto:${profile.email}`}
                  className="inline-flex items-center gap-2 border border-[var(--color-gold-dim)] px-6 py-3 text-sm tracking-wide text-[var(--color-gold)] transition-all hover:bg-[var(--color-gold)]/10"
                >
                  <Mail className="h-4 w-4" /> 写封邮件
                </a>
              ) : null}
              <Link
                href="/about"
                className="text-sm text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text-bright)]"
              >
                了解更多 →
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
