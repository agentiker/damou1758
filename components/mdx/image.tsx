import NextImage from "next/image";
import { cn } from "@/lib/utils";

type Props = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  caption?: string;
  className?: string;
};

/** 文章内嵌图片：走 next/image 自动优化（本地 /public 与 /static 资源均可）。 */
export function Image({ src, alt, width = 1200, height = 630, caption, className }: Props) {
  return (
    <figure className={cn("my-6", className)}>
      <NextImage
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes="(max-width: 768px) 100vw, 768px"
        className="h-auto w-full rounded-xl border border-[var(--color-border)]"
      />
      {caption ? (
        <figcaption className="mt-2 text-center text-sm text-neutral-500">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
