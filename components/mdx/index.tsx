import { Image } from "./image";
import { Video } from "./video";
import { YouTubeEmbed, BilibiliEmbed } from "./embeds";
import { Callout } from "./callout";
import { Steps } from "./steps";

/** 在 MDX 文章里可直接使用的组件集合。 */
export const mdxComponents: Record<string, React.ComponentType<any>> = {
  Image,
  Video,
  YouTubeEmbed,
  BilibiliEmbed,
  Callout,
  Steps,
};

