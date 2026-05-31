# CLAUDE.md

个人 IP 内容站：分享 AI Coding / Agent Engineering / AI Workflow 教程。核心理念：**写文件 → push → 自动发布**。

## 技术栈

Next.js 15 (App Router, RSC) · TypeScript · Tailwind v4 · Velite（内容层，Zod 校验 md/mdx/json）· MDX + rehype-pretty-code(Shiki) · Framer Motion · pnpm · 部署 Vercel。

## 关键约定

- **内容即文件**：文章在 `content/posts/<日期-slug>/index.mdx`，配图在同目录 `assets/`；结构化数据在 `content/data/*.json`。
- **schema 是唯一真相**：所有内容字段由 `velite.config.ts` 的 Zod schema 定义并在构建期校验。改字段先改 schema。`category` 是枚举（三类），写错构建失败。
- **Velite 独立进程**：不走 webpack 插件。`dev` 用 concurrently 同时跑 `velite --watch` 和 `next dev`；`build`/`check` 用 `velite --strict`（非零退出拦截坏内容）。
- **生成产物不提交**：`.velite/`、`public/static/` 由 velite 生成，已 gitignore。
- **客户端不打包文章**：客户端组件（`"use client"`）只引 `@/lib/categories`（纯配置），数据通过 props 传入；服务端组件才从 `@/lib/content` 读 `.velite` 数据。

## 目录

- `app/` —— 路由：`/`(首页) `/posts` `/posts/[slug]` `/category/[cat]` `/about` `/rss.xml`
- `components/mdx/` —— 文章内可用组件（Callout/Image/Video/Embeds/Steps），经 `mdx-content.tsx` 渲染
- `components/site/` —— 站点骨架（Nav/Footer/Hero/PostCard/CategoryCard/Reveal）
- `lib/content.ts` —— 读 `.velite` + 文章查询助手；`lib/categories.ts` —— 纯分类配置
- `scripts/new-post.ts` —— `pnpm new` 脚手架
- `.claude/skills/write-post/` —— AI 写作流水线

## 编码规范

不可变数据（不原地改对象）· 小文件高内聚 · 所有外部输入校验（已用 Zod）· 错误显式处理。

## 常用命令

`pnpm dev` · `pnpm new "标题" --category "AI Coding"` · `pnpm check`（发布前必过）· `pnpm build`
