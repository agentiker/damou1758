"use client";

import Link from "next/link";
import NextImage from "next/image";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";

type Props = {
  name: string;
  tagline: string;
  bio: string;
  avatar?: string;
};

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] } },
});

export function Hero({ name, tagline, bio, avatar }: Props) {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      <div className="hero-glow" />

      {/* 左侧边线 */}
      <div className="absolute left-6 lg:left-8 top-20 bottom-20 w-px bg-[var(--color-border)]" />

      <div className="mx-auto w-full max-w-6xl px-6 lg:px-8 py-24 sm:py-32">
        <div className="grid gap-16 lg:grid-cols-[1fr_280px] lg:gap-24 items-center">
          <div>
            <motion.div {...fadeUp(0)}>
              <span className="section-label">LOG 001 · INTRO</span>
            </motion.div>

            <motion.h1
              {...fadeUp(0.15)}
              className="mt-6 font-[var(--font-display)] text-5xl leading-[1.1] tracking-tight text-[var(--color-text-bright)] sm:text-7xl"
            >
              {tagline}
            </motion.h1>

            <motion.p
              {...fadeUp(0.3)}
              className="mt-8 max-w-lg text-lg leading-relaxed text-[var(--color-text-muted)]"
            >
              {bio}
            </motion.p>

            <motion.div {...fadeUp(0.45)} className="mt-10 flex items-center gap-5">
              <Link
                href="/posts"
                className="inline-flex items-center gap-2 border border-[var(--color-gold-dim)] px-6 py-3 text-sm font-medium tracking-wide text-[var(--color-gold)] transition-all hover:bg-[var(--color-gold)]/10 hover:border-[var(--color-gold)]"
              >
                阅读日志
              </Link>
              <Link
                href="/about"
                className="text-sm text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text-bright)]"
              >
                了解更多 →
              </Link>
            </motion.div>
          </div>

          {avatar ? (
            <motion.div {...fadeUp(0.3)} className="hidden lg:block">
              <div className="relative">
                <div className="absolute -inset-4 border border-[var(--color-border)] opacity-50" />
                <NextImage
                  src={avatar}
                  alt={name}
                  width={280}
                  height={280}
                  className="relative w-full grayscale-[30%] contrast-[1.05]"
                />
                <div className="absolute -bottom-3 -right-3 bg-[var(--color-bg)] px-3 py-1">
                  <span className="section-label">{name}</span>
                </div>
              </div>
            </motion.div>
          ) : null}
        </div>

        {/* 底部滚动指示 */}
        <motion.div
          {...fadeUp(0.6)}
          className="mt-20 flex items-center gap-3"
        >
          <ArrowDown className="h-3 w-3 text-[var(--color-text-muted)] animate-bounce" />
          <span className="text-xs tracking-[0.15em] uppercase text-[var(--color-text-muted)]">
            向下探索
          </span>
        </motion.div>
      </div>
    </section>
  );
}
