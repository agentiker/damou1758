type EmbedProps = { title?: string };

function Frame({ src, title }: { src: string; title: string }) {
  return (
    <div className="my-6 aspect-video w-full overflow-hidden rounded-xl border border-[var(--color-border)] bg-black">
      <iframe
        src={src}
        title={title}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="h-full w-full"
      />
    </div>
  );
}

/** YouTube 嵌入：传 video id。 */
export function YouTubeEmbed({ id, title = "YouTube video" }: { id: string } & EmbedProps) {
  return <Frame src={`https://www.youtube-nocookie.com/embed/${id}`} title={title} />;
}

/** Bilibili 嵌入：传 BV 号。 */
export function BilibiliEmbed({ bvid, title = "Bilibili video" }: { bvid: string } & EmbedProps) {
  return (
    <Frame
      src={`https://player.bilibili.com/player.html?bvid=${bvid}&autoplay=0&high_quality=1`}
      title={title}
    />
  );
}
