import Link from "next/link";
import { Github, Twitter, Youtube, Video, Mail } from "lucide-react";
import { profile } from "@/lib/content";

const ICONS: Record<string, typeof Github> = {
  github: Github,
  twitter: Twitter,
  youtube: Youtube,
  video: Video,
};

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-[var(--color-border)]">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-5 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-bold text-white">{profile.name}</p>
          <p className="mt-1 text-sm text-neutral-500">{profile.tagline}</p>
        </div>
        <div className="flex items-center gap-4">
          {profile.socials.map((s) => {
            const Icon = ICONS[s.icon ?? ""] ?? Github;
            return (
              <a
                key={s.href}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={s.label}
                className="text-neutral-500 transition-colors hover:text-white"
              >
                <Icon className="h-5 w-5" />
              </a>
            );
          })}
          {profile.email ? (
            <a
              href={`mailto:${profile.email}`}
              aria-label="Email"
              className="text-neutral-500 transition-colors hover:text-white"
            >
              <Mail className="h-5 w-5" />
            </a>
          ) : null}
        </div>
      </div>
      <div className="border-t border-[var(--color-border)] py-5 text-center text-xs text-neutral-600">
        © {new Date().getFullYear()} {profile.name} ·{" "}
        <Link href="/rss.xml" className="hover:text-neutral-400">
          RSS 订阅
        </Link>
      </div>
    </footer>
  );
}
