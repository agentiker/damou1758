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
    <footer className="mt-32">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="rule" />

        <div className="flex flex-col gap-8 py-12 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="font-[var(--font-display)] text-lg text-[var(--color-text-bright)]">
              {profile.name}
            </p>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">{profile.tagline}</p>
          </div>

          <div className="flex flex-col items-start gap-4 sm:items-end">
            <div className="flex items-center gap-5">
              {profile.socials.map((s) => {
                const Icon = ICONS[s.icon ?? ""] ?? Github;
                return (
                  <a
                    key={s.href}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.label}
                    className="text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-gold)]"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
              {profile.email ? (
                <a
                  href={`mailto:${profile.email}`}
                  aria-label="Email"
                  className="text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-gold)]"
                >
                  <Mail className="h-4 w-4" />
                </a>
              ) : null}
            </div>
            <div className="flex items-center gap-4 text-xs text-[var(--color-text-muted)]">
              <Link href="/rss.xml" className="hover:text-[var(--color-gold)]">RSS</Link>
              <span className="text-[var(--color-border)]">·</span>
              <span>© {new Date().getFullYear()}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
