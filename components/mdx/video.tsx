"use client";

type Props = {
  src: string;
  poster?: string;
  caption?: string;
};

/** 本地或远程视频播放器（mp4/webm）。 */
export function Video({ src, poster, caption }: Props) {
  return (
    <figure className="my-6">
      <video
        controls
        preload="metadata"
        poster={poster}
        className="w-full rounded-xl border border-[var(--color-border)] bg-black"
      >
        <source src={src} />
        你的浏览器不支持 video 标签。
      </video>
      {caption ? (
        <figcaption className="mt-2 text-center text-sm text-neutral-500">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
