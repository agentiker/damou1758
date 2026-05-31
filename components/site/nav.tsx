"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "文章", href: "/posts" },
  { label: "关于", href: "/about" },
];

export function SiteNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[var(--color-bg)]/90 backdrop-blur-xl">
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6 lg:px-8">
        <Link
          href="/"
          className="font-[var(--font-mono)] text-xs tracking-[0.2em] uppercase text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-gold)]"
        >
          姜无维
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-xs tracking-[0.12em] uppercase text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text-bright)]"
            >
              {l.label}
            </Link>
          ))}
          <span className="h-3 w-px bg-[var(--color-border)]" />
          <Link
            href="/rss.xml"
            className="text-xs tracking-[0.12em] uppercase text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-gold)]"
          >
            RSS
          </Link>
        </div>

        <button
          className="md:hidden text-[var(--color-text-muted)]"
          onClick={() => setOpen((v) => !v)}
          aria-label="菜单"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      <div
        className={cn(
          "md:hidden overflow-hidden transition-all duration-300",
          open ? "max-h-60 border-t border-[var(--color-border)]" : "max-h-0"
        )}
      >
        <div className="flex flex-col gap-1 px-6 py-4">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="py-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-bright)]"
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
