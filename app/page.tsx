import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";
import { Hero } from "@/components/site/hero";
import { Reveal } from "@/components/site/reveal";
import { PostCard } from "@/components/site/post-card";
import { CategoryCard } from "@/components/site/category-card";
import {
  profile,
  tools,
  roadmap,
  CATEGORIES,
  featuredPosts,
  postsByCategory,
} from "@/lib/content";

function SectionHeading({ title, desc, href }: { title: string; desc?: string; href?: string }) {
  return (
    <div className="mb-8 flex items-end justify-between gap-4">
      <div>
        <h2 className="text-2xl font-bold text-white sm:text-3xl">{title}</h2>
        {desc ? <p className="mt-2 text-neutral-400">{desc}</p> : null}
      </div>
      {href ? (
        <Link
          href={href}
          className="inline-flex shrink-0 items-center gap-1 text-sm text-neutral-400 hover:text-white"
        >
          全部 <ArrowRight className="h-4 w-4" />
        </Link>
      ) : null}
    </div>
  );
}

export default function HomePage() {
  const featured = featuredPosts(4);

  return (
    <>
      <Hero
        name={profile.name}
        tagline={profile.tagline}
        bio={profile.bio}
        avatar={profile.avatar}
      />

      {/* 数据墙 */}
      <section className="mx-auto max-w-5xl px-5">
        <Reveal>
          <div className="grid grid-cols-2 gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:grid-cols-4">
            {profile.stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-2xl font-extrabold text-white sm:text-3xl">{s.value}</div>
                <div className="mt-1 text-xs text-neutral-500">{s.label}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* 精选文章 */}
      <section className="mx-auto max-w-5xl px-5 pt-20">
        <Reveal>
          <SectionHeading title="精选文章" desc="最近的实战记录与方法沉淀" href="/posts" />
        </Reveal>
        <div className="grid gap-6 sm:grid-cols-2">
          {featured.map((post, i) => (
            <Reveal key={post.slug} delay={i * 0.05}>
              <PostCard post={post} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* 三大主题 */}
      <section className="mx-auto max-w-5xl px-5 pt-20">
        <Reveal>
          <SectionHeading title="三大主题" desc="按你的学习路径选择切入点" />
        </Reveal>
        <div className="grid gap-6 sm:grid-cols-3">
          {CATEGORIES.map((c, i) => (
            <Reveal key={c.slug} delay={i * 0.05}>
              <CategoryCard category={c} count={postsByCategory(c.name).length} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* 精选工具 */}
      <section className="mx-auto max-w-5xl px-5 pt-20">
        <Reveal>
          <SectionHeading title="精选工具" desc="我日常在用的 AI 工具清单（数据来自 JSON）" />
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.03}>
              <a
                href={t.href ?? "#"}
                target="_blank"
                rel="noreferrer"
                className="flex h-full flex-col rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 transition-colors hover:border-neutral-600"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white">{t.name}</span>
                  {t.tag ? (
                    <span className="rounded-full bg-white/5 px-2 py-0.5 text-xs text-neutral-400">
                      {t.tag}
                    </span>
                  ) : null}
                </div>
                <p className="mt-2 text-sm text-neutral-400">{t.description}</p>
                <span className="mt-3 text-xs text-neutral-600">{t.category}</span>
              </a>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 学习路线图 */}
      <section className="mx-auto max-w-5xl px-5 pt-20">
        <Reveal>
          <SectionHeading title="学习路线图" desc="从入门到自动化，一步步来（数据来自 JSON）" />
        </Reveal>
        <div className="grid gap-6 sm:grid-cols-3">
          {roadmap.map((stage, i) => (
            <Reveal key={stage.stage} delay={i * 0.05}>
              <div className="h-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
                <div className="text-4xl font-extrabold text-neutral-700">{stage.stage}</div>
                <h3 className="mt-2 text-lg font-bold text-white">{stage.title}</h3>
                <ul className="mt-4 space-y-2 text-sm text-neutral-400">
                  {stage.items.map((it) => (
                    <li key={it} className="flex gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400" />
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 联系 CTA */}
      <section className="mx-auto max-w-5xl px-5 pt-20">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-[var(--color-border)] bg-gradient-to-br from-indigo-600/20 to-fuchsia-600/10 p-10 text-center">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">一起把一个人做成一支团队</h2>
            <p className="mx-auto mt-3 max-w-xl text-neutral-300">
              订阅更新，或直接来聊聊你的 AI 工程难题。
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {profile.email ? (
                <a
                  href={`mailto:${profile.email}`}
                  className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition-transform hover:scale-105"
                >
                  <Mail className="h-4 w-4" /> 联系我
                </a>
              ) : null}
              <Link
                href="/about"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white hover:bg-white/5"
              >
                关于我 <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
