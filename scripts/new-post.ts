#!/usr/bin/env tsx
/**
 * 新建文章脚手架：pnpm new "标题" [--category "AI Coding"] [--slug my-slug] [--tags a,b]
 * 生成 content/posts/<日期-slug>/index.mdx（含 frontmatter 模板）与 assets/ 目录。
 */
import { mkdir, writeFile, access } from "node:fs/promises";
import { join } from "node:path";

const CATEGORIES = ["AI Coding", "Agent Engineering", "AI Workflow"] as const;
type Category = (typeof CATEGORIES)[number];

function parseArgs(argv: string[]) {
  const positional: string[] = [];
  const flags: Record<string, string> = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) {
      flags[a.slice(2)] = argv[++i] ?? "";
    } else {
      positional.push(a);
    }
  }
  return { positional, flags };
}

function slugify(input: string): string {
  const s = input
    .toLowerCase()
    .trim()
    .replace(/[\s/]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  // 中文等非 ASCII 标题会被清空，回退到时间戳短 id
  return s || `post-${Date.now().toString(36)}`;
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

async function exists(p: string): Promise<boolean> {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const { positional, flags } = parseArgs(process.argv.slice(2));
  const title = positional.join(" ").trim();

  if (!title) {
    console.error('用法: pnpm new "文章标题" [--category "AI Coding"] [--slug my-slug] [--tags a,b]');
    process.exit(1);
  }

  const category = (flags.category as Category) ?? "AI Coding";
  if (!CATEGORIES.includes(category)) {
    console.error(`category 必须是: ${CATEGORIES.join(" / ")}`);
    process.exit(1);
  }

  const date = todayISO();
  const slug = flags.slug ? slugify(flags.slug) : slugify(title);
  const dirName = `${date}-${slug}`;
  const dir = join("content", "posts", dirName);

  if (await exists(dir)) {
    console.error(`目录已存在: ${dir}`);
    process.exit(1);
  }

  const tags = (flags.tags ?? "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  const frontmatter = [
    "---",
    `title: ${title}`,
    `date: ${date}`,
    `category: ${category}`,
    `tags: [${tags.join(", ")}]`,
    "summary: 一句话说清这篇讲什么（会显示在卡片和 SEO）。",
    "# cover: ./assets/cover.png   # 放好封面图后取消注释",
    "draft: true",
    "---",
    "",
    `# ${title}`,
    "",
    "开篇用一句话点明读者能得到什么。",
    "",
    "## 第一节",
    "",
    "正文……可用以下组件嵌入富媒体：",
    "",
    "<Callout type=\"tip\">小贴士写在这里。</Callout>",
    "",
    "<Image src=\"/demo-diagram.svg\" alt=\"示意图\" width={1200} height={600} />",
    "",
    "<YouTubeEmbed id=\"VIDEO_ID\" title=\"视频标题\" />",
    "",
    "```ts",
    "console.log(\"hello\");",
    "```",
    "",
    "## 小结",
    "",
    "- 要点一",
    "- 要点二",
    "",
  ].join("\n");

  await mkdir(join(dir, "assets"), { recursive: true });
  await writeFile(join(dir, "index.mdx"), frontmatter, "utf8");
  await writeFile(join(dir, "assets", ".gitkeep"), "", "utf8");

  console.log(`✓ 已创建 ${join(dir, "index.mdx")}`);
  console.log(`  分类: ${category} | slug: ${slug}`);
  console.log("");
  console.log("下一步：");
  console.log(`  1. 编辑正文，把封面图放进 ${join(dir, "assets")}/`);
  console.log("  2. 写完把 frontmatter 的 draft 改成 false");
  console.log("  3. pnpm dev 本地预览 → pnpm check 校验 → git push 发布");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
