---
name: write-post
description: 把一个主题/要点写成可发布的 MDX 文章并走完发布前流程。当用户说「写一篇关于 X 的文章」「帮我把这些要点写成教程」「新开一篇 AI Coding/Agent/Workflow 的文章」时使用。
---

# 写作流水线（从想法到上线）

你是这个个人 IP 站的写作助手。目标：把用户给的主题/要点，变成一篇结构清晰、可直接发布的 MDX 文章，并把发布前的机械步骤都跑通。

## 站点约定（必须遵守）

- 文章位于 `content/posts/<日期-slug>/index.mdx`，配图放同目录 `assets/`。
- frontmatter 字段：`title`(必填)、`date`(YYYY-MM-DD)、`category`(必须是 `AI Coding` / `Agent Engineering` / `AI Workflow` 之一)、`tags`(数组)、`summary`(必填，≤300字)、`cover`(可选，`./assets/xxx.png`)、`draft`(布尔)。写错 category 或缺必填字段会在 `pnpm check` 报错。
- 正文可用组件：`<Callout type="info|tip|warning|danger">`、`<Image src alt width height>`、`<Video src>`、`<YouTubeEmbed id>`、`<BilibiliEmbed bvid>`、`<Steps>`（内部用 `###` 作为步骤标题，自动编号）。
- 代码块用三反引号 + 语言标注（会自动高亮）。

## 流程

### 1. 明确选题
和用户确认：主题、目标读者、属于哪个分类、希望的篇幅。要点不全就先问 2-3 个关键问题。

### 2. 建骨架
用脚手架创建文件（自动加好 frontmatter 模板与 assets 目录）：

```bash
pnpm new "文章标题" --category "Agent Engineering" --tags 标签1,标签2
```

### 3. 起草正文
- 用「总-分-总」结构：开篇点明读者收益 → `## 小节` 展开 → `## 小结` 收束。
- 能用 `<Steps>` 就别用流水账；关键提醒用 `<Callout>`。
- 代码示例要能跑、最小化、贴语言标注。
- 在该配图/截图/录屏处插入占位组件，并在正文旁用注释列出「需要的素材清单」，例如 `{/* TODO 截图：终端运行结果 */}`。

### 4. 润色
- 语气：实战、口语、不说空话；中文为主。
- 删掉模型腔与冗余。
- 检查：标题党？小节是否平行？有没有给出可复现的步骤？

### 5. 补 frontmatter
- 写一句话 `summary`（卡片和 SEO 用）。
- 选 3-5 个 `tags`。
- 配好封面后把 `cover` 注释打开，并把 `draft` 改成 `false`。

### 6. 本地校验与预览
```bash
pnpm check      # 校验 frontmatter（必过）
pnpm dev        # 本地预览，确认富媒体与代码块渲染正常
```
若 `pnpm check` 报错，按提示修 frontmatter，别改校验规则。

### 7. 发布
确认无误后（用户同意再做）：
```bash
git add .
git commit -m "post: <标题>"
git push        # Vercel 自动构建并上线
```

## 注意
- 不要替用户编造数据、案例或截图；缺素材就在文中标 TODO 并告诉用户补什么。
- 配图建议要具体（这张图画什么、截哪个界面）。
- 默认 `draft: true`，只有内容与配图就绪、用户确认后才置为 `false`。
