/** @type {import('next').NextConfig} */
const nextConfig = {
  // Velite 作为独立进程运行（见 package.json scripts），此处无需 webpack 插件。
  images: {
    // 放行站内自有 SVG（如文章示意图），并设最小 CSP。
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // 允许文章内嵌远程图片（如需）；本地图片走 next/image 自动优化。
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
};

export default nextConfig;
