import {
  plugins as pluginsData,
  pluginDocs as pluginDocsData,
  type Plugin,
  type PluginDoc,
} from "@/.velite";

export type { Plugin, PluginDoc };
export {
  PLUGIN_CATEGORIES,
  pluginCategoryBySlug,
  pluginCategoryByName,
  type PluginCategory,
  type PluginCategorySlug,
} from "@/lib/plugin-categories";

/** 全部精选插件，按 stars 降序（不可变副本）。 */
export function allPlugins(): Plugin[] {
  return [...pluginsData].sort((a, b) => (b.stars ?? 0) - (a.stars ?? 0));
}

/** 首页精选：优先取 featured；不足则按 stars 补齐。 */
export function featuredPlugins(n = 6): Plugin[] {
  const sorted = allPlugins();
  const featured = sorted.filter((p) => p.featured);
  const rest = sorted.filter((p) => !p.featured);
  return [...featured, ...rest].slice(0, n);
}

/** 按分类 slug 过滤（p.category 即枚举 slug）。 */
export function pluginsByCategory(slug: string): Plugin[] {
  return allPlugins().filter((p) => p.category === slug);
}

export function pluginBySlug(owner: string, repo: string): Plugin | undefined {
  return pluginsData.find((p) => p.owner === owner && p.repo === repo);
}

export function pluginDocBySlug(
  owner: string,
  repo: string
): PluginDoc | undefined {
  return pluginDocsData.find((d) => d.owner === owner && d.repo === repo);
}
