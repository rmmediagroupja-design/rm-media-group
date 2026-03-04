import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow images from external Unsplash URLs
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
