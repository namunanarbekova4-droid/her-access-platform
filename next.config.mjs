/** @type {import('next').NextConfig} */
const nextConfig = {
  // Transpile ESM-only packages so Next.js can bundle them correctly
  transpilePackages: ["react-markdown", "remark-gfm", "remark-parse", "unified", "bail", "is-plain-obj", "trough", "vfile", "vfile-message", "unist-util-stringify-position", "mdast-util-from-markdown", "mdast-util-to-string", "micromark", "decode-named-character-reference", "character-entities", "mdast-util-gfm", "mdast-util-gfm-autolink-literal", "mdast-util-gfm-footnote", "mdast-util-gfm-strikethrough", "mdast-util-gfm-table", "mdast-util-gfm-task-list-item", "mdast-util-to-hast", "hast-util-to-jsx-runtime", "rehype-react"],
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000", "*.vercel.app"],
    },
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
