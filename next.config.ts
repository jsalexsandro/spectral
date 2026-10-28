import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

const nextConfig: NextConfig = {
  ...(isDev ? { allowedDevOrigins: ["*.app.github.dev"] } : {}),
  experimental: {
    agentFeedback: true,
    ...(isDev
      ? {
          serverActions: {
            allowedOrigins: ["localhost:3000", "*.app.github.dev"],
          },
        }
      : {}),
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
