import { defineConfig, defineCollection, s } from "velite";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import remarkGfm from "remark-gfm";

// 三大主题分类（枚举：写错即在构建期报错）
const CATEGORIES = ["AI Coding", "Agent Engineering", "AI Workflow"] as const;

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

export default defineConfig({
  root: "content",
  output: {
    data: ".velite",
    assets: "public/static",
    base: "/static/",
    name: "[name]-[hash:6].[ext]",
    clean: true,
  },
  collections: { posts, profile, tools, roadmap },
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
});
