import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    //TODO: add apple link
    domains: [
      "gateway.mesh3.network",
      "gateway.lighthouse.storage",
      "assets.react-photo-album.com",
      "lh3.googleusercontent.com",
      "cdn.discordapp.com",
    ], // ✅ Allow both domains
  },
  env: {
    NEXT_PUBLIC_BUILD_VERSION: `1.0.0-${Date.now()}`,
  },
};

export default nextConfig;
