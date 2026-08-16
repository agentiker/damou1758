/**
 * 纯插件分类配置——不依赖 .velite，可安全被客户端组件引用。
 * slug 必须与 velite.config.ts 的 PLUGIN_CATEGORIES 枚举一一对应。
 */
export const PLUGIN_CATEGORIES = [
  {
    name: "UI 与体验",
    slug: "ui",
    description: "侧边栏、主题、状态动画、移动端适配——让 DSH 界面更顺手。",
    accent: "#0ea5e9",
  },
  {
    name: "模型与提供方",
    slug: "models",
    description: "接入更多模型、切换 Provider、统计用量与余额。",
    accent: "#6366f1",
  },
  {
    name: "工具与能力",
    slug: "tools",
    description: "给纯文本 Agent 外挂视觉、图表、文件树等新能力。",
    accent: "#a855f7",
  },
  {
    name: "Skills 技能",
    slug: "skills",
    description: "可复用的技能包，教会 Agent 完成特定领域的活儿。",
    accent: "#ec4899",
  },
  {
    name: "工作流与自动化",
    slug: "workflow",
    description: "编排多智能体、循环研究、把重复劳动连成流水线。",
    accent: "#10b981",
  },
  {
    name: "运行时与生态",
    slug: "runtime",
    description: "桌面端、TUI、沙箱运行时、插件市场与管理器。",
    accent: "#f59e0b",
  },
] as const;

export type PluginCategory = (typeof PLUGIN_CATEGORIES)[number];
export type PluginCategorySlug = PluginCategory["slug"];

export function pluginCategoryBySlug(slug: string) {
  return PLUGIN_CATEGORIES.find((c) => c.slug === slug);
}

export function pluginCategoryByName(name: string) {
  return PLUGIN_CATEGORIES.find((c) => c.name === name);
}
