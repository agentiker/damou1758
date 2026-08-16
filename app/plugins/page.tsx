import type { Metadata } from "next";
import { Reveal } from "@/components/site/reveal";
import { PluginFilter } from "@/components/site/plugin-filter";
import { allPlugins } from "@/lib/plugins";

export const metadata: Metadata = {
  title: "精选 DeepSeek Harness 插件",
  description:
    "为 DeepSeek Harness (DSH) 精选的高质量插件：UI 与体验、模型与提供方、工具与能力、Skills、工作流与运行时。点开任意一个，直接读它锁定版本的 README。",
  openGraph: {
    title: "精选 DeepSeek Harness 插件",
    description:
      "DeepSeek Harness「一切皆插件」——这里挑出社区里真正好用的一批，按用途分类。",
    type: "website",
  },
};

export default function PluginsPage() {
  const plugins = allPlugins();

  return (
    <div className="mx-auto max-w-6xl px-6 lg:px-8 pt-16 pb-20">
      <span className="section-label">DEEPSEEK HARNESS · PLUGINS</span>
      <h1 className="mt-4 font-[var(--font-display)] text-3xl text-[var(--color-text-bright)] sm:text-4xl">
        精选 DSH 插件
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--color-text-muted)]">
        DeepSeek Harness「一切皆插件」——模型、工具、UI、甚至 Agent 循环都能替换。
        这里从社区里挑出真正好用的一批，按用途分类；点开任意一个，直接读它锁定版本的 README。
      </p>

      <Reveal>
        <PluginFilter plugins={plugins} />
      </Reveal>
    </div>
  );
}
