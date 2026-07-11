import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 85, 90, 95],
    deviceSizes: [640, 828, 1080, 1200, 1920, 2560],
    minimumCacheTTL: 2592000,
  },
};

export default nextConfig;
