import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { CATEGORIES } from "@/lib/categories";

type Category = (typeof CATEGORIES)[number];

export function CategoryCard({
  category,
  count,
  index = 0,
}: {
  category: Category;
  count: number;
  index?: number;
}) {
  const num = String(index + 1).padStart(2, "0");

  return (
    <Link
      href={`/category/${category.slug}`}
      className="group relative block border-t border-[var(--color-border)] py-8 transition-colors hover:border-[var(--color-gold-dim)]"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="font-[var(--font-mono)] text-xs text-[var(--color-text-muted)]">
            {num}
          </span>
          <h3 className="mt-2 font-[var(--font-display)] text-2xl text-[var(--color-text-bright)] transition-colors group-hover:text-[var(--color-gold)]">
            {category.name}
          </h3>
          <p className="mt-2 max-w-sm text-sm text-[var(--color-text-muted)]">
            {category.description}
          </p>
        </div>

        <div className="flex flex-col items-end gap-3 pt-6">
          <span className="font-[var(--font-mono)] text-xs text-[var(--color-text-muted)]">
            {count} 篇
          </span>
          <ArrowRight className="h-4 w-4 text-[var(--color-text-muted)] transition-all group-hover:text-[var(--color-gold)] group-hover:translate-x-1" />
        </div>
      </div>

      <div
        className="absolute bottom-0 left-0 h-px w-0 transition-all duration-500 group-hover:w-full"
        style={{ backgroundColor: category.accent }}
      />
    </Link>
  );
}
