/** 纯分类配置——不依赖 .velite，可安全被客户端组件引用。 */
export const CATEGORIES = [
  {
    name: "AI Coding",
    slug: "ai-coding",
    description: "用 AI 写代码的实战方法与可复现流程。",
    accent: "#0ea5e9",
  },
  {
    name: "Agent Engineering",
    slug: "agent-engineering",
    description: "搭会用工具、能多步推理的智能体。",
    accent: "#6366f1",
  },
  {
    name: "AI Workflow",
    slug: "ai-workflow",
    description: "把重复劳动连成可自动化的流水线。",
    accent: "#a855f7",
  },
] as const;

export type CategoryName = (typeof CATEGORIES)[number]["name"];

export function categoryBySlug(slug: string) {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function categoryByName(name: string) {
  return CATEGORIES.find((c) => c.name === name);
}
