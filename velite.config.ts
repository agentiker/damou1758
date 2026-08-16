import { defineConfig, defineCollection, s } from "velite";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import remarkGfm from "remark-gfm";

// 三大主题分类（枚举：写错即在构建期报错）
const CATEGORIES = ["AI Coding", "Agent Engineering", "AI Workflow"] as const;

// 精选插件分类（枚举：与 lib/plugin-categories.ts 的 slug 一一对应）
const PLUGIN_CATEGORIES = [
  "ui",
  "models",
  "tools",
  "skills",
  "workflow",
  "runtime",
] as const;

/** 文章集合：content/posts/<date-slug>/index.mdx */
const posts = defineCollection({
  name: "Post",
  pattern: "posts/**/index.mdx",
  schema: s
    .object({
      title: s.string().max(120),
      date: s.isodate(),
      category: s.enum(CATEGORIES),
      tags: s.array(s.string()).default([]),
      summary: s.string().max(300),
      cover: s.image().optional(),
      draft: s.boolean().default(false),
      metadata: s.metadata(), // 自动计算 readingTime / wordCount
      content: s.mdx(), // 编译后的 MDX 代码
      path: s.path(),
    })
    .transform((data) => {
      const slug = data.path
        .replace(/^posts\//, "")
        .replace(/\/index$/, "");
      return { ...data, slug, permalink: `/posts/${slug}` };
    }),
});

/** 首页个人资料（单文件单对象） */
const profile = defineCollection({
  name: "Profile",
  pattern: "data/profile.json",
  single: true,
  schema: s.object({
    name: s.string(),
    handle: s.string().optional(),
    tagline: s.string(),
    bio: s.string(),
    avatar: s.string().optional(), // 指向 /public 下的图片或远程 URL
    stats: s
      .array(s.object({ label: s.string(), value: s.string() }))
      .default([]),
    socials: s
      .array(
        s.object({
          label: s.string(),
          href: s.string(),
          icon: s.string().optional(),
        })
      )
      .default([]),
    email: s.string().optional(),
  }),
});

/** 精选工具清单（JSON 数组） */
const tools = defineCollection({
  name: "Tool",
  pattern: "data/tools.json",
  schema: s.object({
    name: s.string(),
    category: s.string(),
    description: s.string(),
    href: s.string().optional(),
    tag: s.string().optional(),
  }),
});

/** 学习路线图（JSON 数组） */
const roadmap = defineCollection({
  name: "RoadmapStage",
  pattern: "data/roadmap.json",
  schema: s.object({
    stage: s.string(),
    title: s.string(),
    items: s.array(s.string()).default([]),
  }),
});

/**
 * 精选 DeepSeek Harness 插件索引（手工维护 content/data/plugins.json）。
 * stars / version / license / ref 可由 `pnpm sync-plugins` 回填。
 */
const plugins = defineCollection({
  name: "Plugin",
  pattern: "data/plugins.json",
  schema: s
    .object({
      owner: s.string(),
      repo: s.string(),
      name: s.string(),
      summary: s.string().max(300), // 中文一句话（卡片 + SEO description）
      note: s.string().optional(), // 详情页较长的中文精选简介
      category: s.enum(PLUGIN_CATEGORIES),
      ref: s.string().optional(), // 锁定 commit（缺省时由 sync 解析为最新并写回）
      stars: s.number().default(0),
      version: s.string().optional(),
      license: s.string().optional(),
      official: s.boolean().default(false),
      featured: s.boolean().default(false),
      tags: s.array(s.string()).default([]),
    })
    .transform((data) => ({
      ...data,
      slug: `${data.owner}/${data.repo}`,
      href: `https://github.com/${data.owner}/${data.repo}`,
      permalink: `/plugins/${data.owner}/${data.repo}`,
    })),
});

/**
 * 插件 README 正文：由 scripts/sync-plugins.ts 抓取锁定 commit 的 README、
 * 改写相对资源为绝对地址后写入 content/plugins/<owner>/<repo>/index.md 并提交。
 */
const pluginDocs = defineCollection({
  name: "PluginDoc",
  pattern: "plugins/**/index.md",
  schema: s
    .object({
      owner: s.string(),
      repo: s.string(),
      ref: s.string(),
      content: s.markdown(), // 走下方 markdown 管线编译为 HTML
      path: s.path(),
    })
    .transform((data) => ({ ...data, slug: `${data.owner}/${data.repo}` })),
});

/**
 * 渲染第三方 README 的 HTML 白名单：在默认 schema 上放开常见排版元素。
 * 说明：Velite 内部已先跑 rehype-raw（allowDangerousHtml），此处 sanitize 之后
 * 再跑 slug / pretty-code，故代码高亮 span 与标题 id 不会被清洗掉。
 */
const readmeSanitizeSchema = {
  ...defaultSchema,
  tagNames: [
    ...(defaultSchema.tagNames ?? []),
    "details",
    "summary",
    "picture",
    "source",
  ],
  attributes: {
    ...defaultSchema.attributes,
    img: [
      ...(defaultSchema.attributes?.img ?? []),
      "loading",
      "align",
      "width",
      "height",
    ],
    a: [...(defaultSchema.attributes?.a ?? []), "target", "rel"],
    div: [...(defaultSchema.attributes?.div ?? []), "align"],
    p: [...(defaultSchema.attributes?.p ?? []), "align"],
    source: ["srcSet", "media", "type", "sizes"],
  },
};

export default defineConfig({
  root: "content",
  output: {
    data: ".velite",
    assets: "public/static",
    base: "/static/",
    name: "[name]-[hash:6].[ext]",
    clean: true,
  },
  collections: { posts, profile, tools, roadmap, plugins, pluginDocs },
  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypePrettyCode,
        {
          theme: "github-dark",
          keepBackground: false,
        },
      ],
      [
        rehypeAutolinkHeadings,
        {
          behavior: "wrap",
          properties: { className: ["anchor"] },
        },
      ],
    ],
  },
  // 插件 README（s.markdown）专用管线：先 sanitize 第三方 HTML，再高亮/加锚点。
  markdown: {
    copyLinkedFiles: false, // README 资源已在 sync 阶段改写为绝对地址，无需拷贝本地文件
    rehypePlugins: [
      [rehypeSanitize, readmeSanitizeSchema],
      rehypeSlug,
      [
        rehypePrettyCode,
        {
          theme: "github-dark",
          keepBackground: false,
          defaultLang: "plaintext", // 未标注语言的代码块回退为纯文本，避免 Shiki 报错
        },
      ],
    ],
  },
});
