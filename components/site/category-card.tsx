import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { CATEGORIES } from "@/lib/categories";

type Category = (typeof CATEGORIES)[number];

export function CategoryCard({ category, count }: { category: Category; count: number }) {
  return (
    <Link
      href={`/category/${category.slug}`}
      className="group relative overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 transition-colors hover:border-neutral-600"
    >
      <div
        className="absolute -right-8 -top-8 h-28 w-28 rounded-full opacity-20 blur-2xl transition-opacity group-hover:opacity-40"
        style={{ backgroundColor: category.accent }}
      />
      <div className="relative">
        <div
          className="mb-4 h-1.5 w-10 rounded-full"
          style={{ backgroundColor: category.accent }}
        />
        <h3 className="text-xl font-bold text-white">{category.name}</h3>
        <p className="mt-2 text-sm text-neutral-400">{category.description}</p>
        <div className="mt-5 flex items-center gap-1 text-sm text-neutral-500 group-hover:text-white">
          {count} 篇文章 <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}
