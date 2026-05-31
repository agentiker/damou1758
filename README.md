# AI 实战笔记 · 个人 IP 内容站

分享 AI Coding、Agent Engineering、AI Workflow 的实战教程。
**写好一个 markdown/JSON 文件 → `git push` → 自动构建上线。**

## 技术栈

Next.js 15（App Router）· Tailwind v4 · Velite（内容层 + Zod 校验）· MDX（Shiki 高亮）· Framer Motion · 部署在 Vercel。

## 本地开发

```bash
pnpm install
pnpm dev      # http://localhost:3000（velite 与 next 同时跑，内容改动热更新）
```

## 写一篇新文章

```bash
# 1. 建骨架（自动生成带 frontmatter 的 index.mdx 与 assets/ 目录）
pnpm new "我的文章标题" --category "AI Coding" --tags Claude,工作流

# 2. 编辑 content/posts/<日期-slug>/index.mdx，配图放进同目录 assets/
# 3. 写完把 frontmatter 的 draft 改为 false

# 4. 本地校验 + 预览
pnpm check    # 校验 frontmatter（严格模式，错了会拦住）
pnpm dev

# 5. 发布
git add . && git commit -m "post: 我的文章标题" && git push
# → Vercel 自动构建并上线
```

> 也可以直接对 Claude 说「帮我写一篇关于 X 的文章」，会自动走 `.claude/skills/write-post` 流水线。

## 文章 frontmatter

```yaml
---
title: 标题                      # 必填
date: 2026-05-31                 # YYYY-MM-DD
category: Agent Engineering      # 仅限 AI Coding / Agent Engineering / AI Workflow
tags: [Claude, 工具调用]          # 可选
summary: 一句话摘要               # 必填，≤300 字
cover: ./assets/cover.png        # 可选封面
draft: false                     # true 则不发布
---
```

## 正文可用组件

`<Callout type="info|tip|warning|danger">`、`<Image src alt width height>`、`<Video src>`、
`<YouTubeEmbed id>`、`<BilibiliEmbed bvid>`、`<Steps>`（内部 `###` 自动编号）。
代码块用三反引号 + 语言标注，自动高亮。

## 结构化数据（JSON）

首页的个人资料 / 工具清单 / 路线图分别来自：

- `content/data/profile.json` —— 姓名、定位、社交、亮点数据
- `content/data/tools.json` —— 精选工具清单
- `content/data/roadmap.json` —— 学习路线图

改 JSON 即改首页，无需动代码（同样有 Zod 校验）。

## 部署到 Vercel

1. 把仓库推到 GitHub。
2. 在 [vercel.com](https://vercel.com) 导入该仓库，框架选 Next.js（其余默认）。
3. 部署完成后每次 `git push` 自动构建上线，PR 自动生成预览环境。
4. （可选）设置环境变量 `NEXT_PUBLIC_SITE_URL=https://你的域名` 让 RSS / OG 链接用正式域名。
5. （可选）在 Vercel 绑定自定义域名。

## 常用命令

| 命令 | 作用 |
|------|------|
| `pnpm dev` | 本地开发 |
| `pnpm new "标题"` | 新建文章骨架 |
| `pnpm check` | 严格校验内容（CI/发布前） |
| `pnpm build` | 生产构建 |
