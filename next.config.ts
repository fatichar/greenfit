import type { NextConfig } from "next";
import { SITE_URL } from "./src/lib/site";

const siteHost = new URL(SITE_URL).host;

const nextConfig: NextConfig = {
  output: "standalone",
  async redirects() {
    return [
      // Collapse the www host onto the canonical apex so only one copy is indexed.
      {
        source: "/:path*",
        has: [{ type: "host", value: `www.${siteHost}` }],
        destination: `${SITE_URL}/:path*`,
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "m.media-amazon.com",
        pathname: "/images/I/**",
      },
    ],
    localPatterns: [
      // Item photos use ?v=<mtime> cache-busting when files are replaced in place.
      // Omitting `search` allows any query string on these paths only.
      {
        pathname: "/images/items/**",
      },
      {
        pathname: "/images/**",
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
