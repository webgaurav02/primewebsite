import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 85, 95],
    deviceSizes: [640, 828, 1080, 1200, 1920, 2560, 3840],
    minimumCacheTTL: 60,
  },
};

export default nextConfig;
