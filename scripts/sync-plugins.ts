#!/usr/bin/env tsx
/**
 * 精选插件同步：pnpm sync-plugins
 *
 * 读取 content/data/plugins.json，对每个条目：
 *   1. 解析锁定 commit（ref 缺省时取默认分支最新 commit，并写回索引）
 *   2. 回填 stars / version / license 快照
 *   3. 抓取该 commit 的 README，剥离其自带 frontmatter
 *   4. 把相对图片 / 链接改写为指向该 commit 的绝对地址（raw / blob）
 *   5. 写入 content/plugins/<owner>/<repo>/index.md（注入 owner/repo/ref frontmatter）
 *
 * 构建期不联网：READMEs 与快照都落地成 git 文件，push 后由 Vercel 直接编译。
 * 设 GITHUB_TOKEN 环境变量可提升 API 限流（未认证仅 60 次/小时）。
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const GH_API = "https://api.github.com";
const RAW = "https://raw.githubusercontent.com";
const INDEX_PATH = join("content", "data", "plugins.json");

// 索引条目的规范字段顺序（回写时保持稳定，便于 diff）
const FIELD_ORDER = [
  "owner", "repo", "name", "category", "featured", "official",
  "stars", "version", "license", "ref", "tags", "summary", "note",
] as const;

type Plugin = Record<string, unknown> & {
  owner: string;
  repo: string;
  ref?: string;
};

function ghHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "damou1758-sync-plugins",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  const token = process.env.GITHUB_TOKEN ?? process.env.GH_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

async function ghFetch(path: string, accept?: string): Promise<Response> {
  const headers = ghHeaders();
  if (accept) headers.Accept = accept;
  const res = await fetch(`${GH_API}${path}`, { headers });
  if (res.status === 403 && res.headers.get("x-ratelimit-remaining") === "0") {
    throw new Error(
      "GitHub API 限流：请设置 GITHUB_TOKEN 环境变量后重试（未认证仅 60 次/小时）。"
    );
  }
  return res;
}

async function ghJson<T>(path: string): Promise<T> {
  const res = await ghFetch(path);
  if (!res.ok) {
    throw new Error(`GET ${path} → ${res.status} ${res.statusText}`);
  }
  return (await res.json()) as T;
}

/** README 原文（找不到返回 null）。 */
async function fetchReadme(owner: string, repo: string, ref: string): Promise<string | null> {
  const res = await ghFetch(
    `/repos/${owner}/${repo}/readme?ref=${encodeURIComponent(ref)}`,
    "application/vnd.github.raw"
  );
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`README ${owner}/${repo} → ${res.status}`);
  return await res.text();
}

/** 剥离 README 开头可能存在的 YAML frontmatter，避免与注入的 frontmatter 冲突。 */
function stripLeadingFrontmatter(md: string): string {
  return md.replace(/^﻿?---\r?\n[\s\S]*?\r?\n---\r?\n?/, "");
}

function isAbsolute(url: string): boolean {
  return (
    /^(https?:)?\/\//i.test(url) ||
    url.startsWith("#") ||
    url.startsWith("data:") ||
    url.startsWith("mailto:")
  );
}

/** 把仓库内相对路径规整为相对仓库根的 posix 路径。 */
function normalizeRepoPath(url: string): string {
  return url.replace(/^\.\//, "").replace(/^\//, "");
}

/** 相对 URL → 指向锁定 commit 的绝对地址；image 走 raw，link 走 blob。 */
function toAbsolute(url: string, owner: string, repo: string, ref: string, image: boolean): string {
  const trimmed = url.trim();
  if (!trimmed || isAbsolute(trimmed)) return url;
  const path = normalizeRepoPath(trimmed);
  return image
    ? `${RAW}/${owner}/${repo}/${ref}/${path}`
    : `${GH_API.replace("api.github.com", "github.com")}/${owner}/${repo}/blob/${ref}/${path}`;
}

/**
 * 把 README 里的相对图片 / 链接改写为绝对地址：
 * 覆盖 Markdown 行内图片/链接、引用式定义，以及 HTML 的 src/href/srcset。
 */
function rewriteRelativeUrls(md: string, owner: string, repo: string, ref: string): string {
  const abs = (u: string, image: boolean) => toAbsolute(u, owner, repo, ref, image);
  const rewriteImageToken = (token: string) =>
    token.replace(
      /!\[([^\]]*)\]\(\s*([^)\s]+)((?:\s+"[^"]*")?)\s*\)/,
      (_m, alt: string, url: string, title: string) => `![${alt}](${abs(url, true)}${title})`
    );

  // 1) 图片被包在链接里：[![alt](img)](link) —— 先处理，避免被通用规则拆错
  let out = md.replace(
    /\[\s*(!\[[^\]]*\]\(\s*[^)\s]+(?:\s+"[^"]*")?\s*\))\s*\]\(\s*([^)\s]+)((?:\s+"[^"]*")?)\s*\)/g,
    (_m, imgToken: string, linkUrl: string, linkTitle: string) =>
      `[${rewriteImageToken(imgToken)}](${abs(linkUrl, false)}${linkTitle})`
  );

  // 2) 独立图片 ![alt](url "title")
  out = out.replace(
    /!\[([^\]]*)\]\(\s*([^)\s]+)((?:\s+"[^"]*")?)\s*\)/g,
    (_m, alt: string, url: string, title: string) => `![${alt}](${abs(url, true)}${title})`
  );

  // 3) 独立链接 [text](url "title")（负向后行断言排除图片）
  out = out.replace(
    /(?<!!)\[([^\]]*)\]\(\s*([^)\s]+)((?:\s+"[^"]*")?)\s*\)/g,
    (_m, text: string, url: string, title: string) => `[${text}](${abs(url, false)}${title})`
  );

  // Markdown 引用式定义：[label]: url  （统一按链接处理，罕见的相对项才会被改写）
  out = out.replace(
    /^(\s*\[[^\]]+\]:\s+)(\S+)/gm,
    (_m, prefix: string, url: string) => `${prefix}${abs(url, false)}`
  );

  // HTML src / href
  out = out.replace(
    /\b(src|href)=("|')([^"']+)\2/gi,
    (_m, attr: string, q: string, url: string) =>
      `${attr}=${q}${abs(url, attr.toLowerCase() === "src")}${q}`
  );

  // HTML srcset（逗号分隔的 "url 描述符"）
  out = out.replace(
    /\bsrcset=("|')([^"']+)\1/gi,
    (_m, q: string, val: string) => {
      const rewritten = val
        .split(",")
        .map((part) => {
          const seg = part.trim();
          const [u, ...rest] = seg.split(/\s+/);
          return [abs(u, true), ...rest].join(" ");
        })
        .join(", ");
      return `srcset=${q}${rewritten}${q}`;
    }
  );

  return out;
}

function toYamlString(v: string): string {
  return JSON.stringify(v); // 双引号包裹并转义，YAML 兼容
}

/** 按规范顺序重建条目对象（不可变），丢弃 undefined。 */
function normalizeEntry(entry: Plugin): Plugin {
  const next: Record<string, unknown> = {};
  for (const key of FIELD_ORDER) {
    if (entry[key] !== undefined) next[key] = entry[key];
  }
  // 保留任何未列入 FIELD_ORDER 的额外字段
  for (const key of Object.keys(entry)) {
    if (!(key in next)) next[key] = entry[key];
  }
  return next as Plugin;
}

type RepoMeta = { default_branch: string; stargazers_count: number; license: { spdx_id?: string } | null };
type Commit = { sha: string };
type Release = { tag_name: string };

async function syncOne(entry: Plugin): Promise<Plugin> {
  const { owner, repo } = entry;
  const meta = await ghJson<RepoMeta>(`/repos/${owner}/${repo}`);

  // 1) 解析锁定 ref
  let ref = typeof entry.ref === "string" && entry.ref.trim() ? entry.ref.trim() : "";
  if (!ref) {
    const [head] = await ghJson<Commit[]>(
      `/repos/${owner}/${repo}/commits?sha=${encodeURIComponent(meta.default_branch)}&per_page=1`
    );
    if (!head?.sha) throw new Error(`${owner}/${repo}：无法解析默认分支最新 commit`);
    ref = head.sha;
  }

  // 2) 快照：stars / license / version
  const stars = meta.stargazers_count ?? (entry.stars as number) ?? 0;
  const spdx = meta.license?.spdx_id;
  const license = spdx && spdx !== "NOASSERTION" ? spdx : (entry.license as string | undefined);

  let version = entry.version as string | undefined;
  const relRes = await ghFetch(`/repos/${owner}/${repo}/releases/latest`);
  if (relRes.ok) {
    const rel = (await relRes.json()) as Release;
    version = rel.tag_name ?? version;
  } else if (relRes.status !== 404) {
    throw new Error(`releases/latest ${owner}/${repo} → ${relRes.status}`);
  }

  // 3) README → 剥离 frontmatter → 改写相对 URL
  const readme = await fetchReadme(owner, repo, ref);
  if (readme === null) {
    throw new Error(`${owner}/${repo}：仓库无 README（ref=${ref.slice(0, 7)}）`);
  }
  const body = rewriteRelativeUrls(stripLeadingFrontmatter(readme), owner, repo, ref);

  // 4) 写入 content/plugins/<owner>/<repo>/index.md（注入 frontmatter）
  const dir = join("content", "plugins", owner, repo);
  await mkdir(dir, { recursive: true });
  const frontmatter = [
    "---",
    `owner: ${toYamlString(owner)}`,
    `repo: ${toYamlString(repo)}`,
    `ref: ${toYamlString(ref)}`,
    "---",
    "",
  ].join("\n");
  await writeFile(join(dir, "index.md"), frontmatter + body + "\n", "utf8");

  return normalizeEntry({ ...entry, stars, ref, version, license });
}

async function main() {
  const raw = await readFile(INDEX_PATH, "utf8");
  const plugins = JSON.parse(raw) as Plugin[];
  if (!Array.isArray(plugins)) {
    throw new Error(`${INDEX_PATH} 不是数组`);
  }

  const results: Plugin[] = [];
  const failures: string[] = [];

  for (const entry of plugins) {
    const id = `${entry.owner}/${entry.repo}`;
    try {
      const updated = await syncOne(entry);
      results.push(updated);
      console.log(`✓ ${id}  ⭐${updated.stars}  @${String(updated.ref).slice(0, 7)}`);
    } catch (err) {
      // 单条失败不影响其余：保留旧快照，记录错误
      results.push(normalizeEntry(entry));
      const msg = err instanceof Error ? err.message : String(err);
      failures.push(`${id}: ${msg}`);
      console.error(`✗ ${id}  ${msg}`);
    }
  }

  await writeFile(INDEX_PATH, JSON.stringify(results, null, 2) + "\n", "utf8");
  console.log(`\n已写回 ${INDEX_PATH}（${results.length} 条），README → content/plugins/**`);

  if (failures.length) {
    console.error(`\n${failures.length} 条同步失败：`);
    for (const f of failures) console.error(`  - ${f}`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
