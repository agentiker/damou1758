"use client";

import Link from "next/link";
import NextImage from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Rss } from "lucide-react";

type Props = {
  name: string;
  tagline: string;
  bio: string;
  avatar?: string;
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function Hero({ name, tagline, bio, avatar }: Props) {
  return (
    <section className="relative overflow-hidden">
      <div className="grid-bg absolute inset-0 -z-10" />
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="mx-auto flex max-w-5xl flex-col items-center px-5 pt-20 pb-16 text-center sm:pt-28"
      >
        {avatar ? (
          <motion.div variants={item}>
            <NextImage
              src={avatar}
              alt={name}
              width={96}
              height={96}
              className="mb-6 h-24 w-24 rounded-full border border-[var(--color-border)]"
            />
          </motion.div>
        ) : null}

        <motion.p
          variants={item}
          className="mb-4 rounded-full border border-[var(--color-border)] px-4 py-1.5 text-sm text-neutral-400"
        >
          AI Coding · Agent Engineering · AI Workflow
        </motion.p>

        <motion.h1
          variants={item}
          className="max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-6xl"
        >
          <span className="text-gradient">{tagline}</span>
        </motion.h1>

        <motion.p
          variants={item}
          className="mt-6 max-w-2xl text-lg leading-relaxed text-neutral-400"
        >
          {bio}
        </motion.p>

        <motion.div variants={item} className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/posts"
            className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition-transform hover:scale-105"
          >
            看教程 <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/rss.xml"
            className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/5"
          >
            <Rss className="h-4 w-4" /> 订阅更新
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
