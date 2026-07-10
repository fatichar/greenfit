import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    localPatterns: [
      // Recipe photos use ?v=<mtime> cache-busting when files are replaced in place.
      // Omitting `search` allows any query string on these paths only.
      {
        pathname: "/images/items/recipes/**",
      },
      // All other local static assets must not carry query strings.
      {
        pathname: "/**",
        search: "",
      },
    ],
  },
};

export default nextConfig;
