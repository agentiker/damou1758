import type { Metadata } from "next";
import NextImage from "next/image";
import { Github, Twitter, Youtube, Video, Mail } from "lucide-react";
import { profile } from "@/lib/content";

export const metadata: Metadata = {
  title: "关于我",
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
    <div className="mx-auto max-w-3xl px-5 pt-16">
      <div className="flex flex-col items-center text-center">
        {profile.avatar ? (
          <NextImage
            src={profile.avatar}
            alt={profile.name}
            width={112}
            height={112}
            className="h-28 w-28 rounded-full border border-[var(--color-border)]"
          />
        ) : null}
        <h1 className="mt-6 text-3xl font-extrabold text-white">{profile.name}</h1>
        {profile.handle ? (
          <p className="mt-1 text-neutral-500">{profile.handle}</p>
        ) : null}
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-neutral-300">{profile.bio}</p>

        <div className="mt-8 flex items-center gap-4">
          {profile.socials.map((s) => {
            const Icon = ICONS[s.icon ?? ""] ?? Github;
            return (
              <a
                key={s.href}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-full border border-[var(--color-border)] px-4 py-2 text-sm text-neutral-300 hover:bg-white/5"
              >
                <Icon className="h-4 w-4" /> {s.label}
              </a>
            );
          })}
          {profile.email ? (
            <a
              href={`mailto:${profile.email}`}
              className="flex items-center gap-2 rounded-full border border-[var(--color-border)] px-4 py-2 text-sm text-neutral-300 hover:bg-white/5"
            >
              <Mail className="h-4 w-4" /> 邮箱
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}
