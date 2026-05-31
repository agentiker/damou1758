"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { CATEGORIES } from "@/lib/categories";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "文章", href: "/posts" },
  ...CATEGORIES.map((c) => ({ label: c.name, href: `/category/${c.slug}` })),
  { label: "关于", href: "/about" },
];

export function SiteNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-black/70 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-5xl items-center justify-between px-5">
        <Link href="/" className="text-lg font-extrabold tracking-tight text-white">
          <span className="text-gradient">AI</span> 实战笔记
        </Link>

        {/* 桌面导航 */}
        <div className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm text-neutral-400 transition-colors hover:text-white"
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* 移动端开关 */}
        <button
          className="md:hidden text-neutral-300"
          onClick={() => setOpen((v) => !v)}
          aria-label="菜单"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* 移动端菜单 */}
      <div
        className={cn(
          "md:hidden overflow-hidden border-t border-[var(--color-border)] transition-all",
          open ? "max-h-80" : "max-h-0 border-t-0"
        )}
      >
        <div className="flex flex-col gap-1 px-5 py-3">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2 text-sm text-neutral-300 hover:bg-white/5"
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
