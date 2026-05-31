import type { Metadata } from "next";
import NextImage from "next/image";
import { Github, Twitter, Youtube, Video, Mail } from "lucide-react";
import { profile } from "@/lib/content";

export const metadata: Metadata = {
  title: "关于",
  description: profile.bio,
};

const ICONS: Record<string, typeof Github> = {
  github: Github,
  twitter: Twitter,
  youtube: Youtube,
  video: Video,
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 lg:px-8 pt-20 pb-20">
      <span className="section-label">ABOUT</span>

      <div className="mt-10 grid gap-16 lg:grid-cols-[1fr_300px] lg:gap-24">
        <div>
          <h1 className="font-[var(--font-display)] text-4xl text-[var(--color-text-bright)] sm:text-5xl">
            {profile.name}
          </h1>
          {profile.handle ? (
            <p className="mt-2 font-[var(--font-mono)] text-sm text-[var(--color-text-muted)]">
              {profile.handle}
            </p>
          ) : null}

          <div className="rule mt-8" />

          <p className="mt-8 max-w-xl text-lg leading-[1.85] text-[var(--color-text)]">
            {profile.bio}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-6">
            {profile.socials.map((s) => {
              const Icon = ICONS[s.icon ?? ""] ?? Github;
              return (
                <a
                  key={s.href}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-gold)]"
                >
                  <Icon className="h-4 w-4" /> {s.label}
                </a>
              );
            })}
            {profile.email ? (
              <a
                href={`mailto:${profile.email}`}
                className="inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-gold)]"
              >
                <Mail className="h-4 w-4" /> 邮箱
              </a>
            ) : null}
          </div>
        </div>

        {profile.avatar ? (
          <div className="hidden lg:block">
            <div className="relative">
              <div className="absolute -inset-3 border border-[var(--color-border)] opacity-50" />
              <NextImage
                src={profile.avatar}
                alt={profile.name}
                width={300}
                height={300}
                className="relative w-full grayscale-[30%] contrast-[1.05]"
              />
            </div>
          </div>
        ) : null}
      </div>

      {/* 身份标签 */}
      <div className="mt-20">
        <div className="rule" />
        <div className="mt-8 grid grid-cols-2 gap-8 sm:grid-cols-4">
          {profile.stats.map((s) => (
            <div key={s.label}>
              <div className="font-[var(--font-display)] text-lg text-[var(--color-text-bright)]">
                {s.value}
              </div>
              <div className="mt-1 text-[0.65rem] tracking-[0.15em] uppercase text-[var(--color-text-muted)]">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
