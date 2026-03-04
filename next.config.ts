import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow images from external Unsplash URLs
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "images-pw.pixieset.com",
      },
    ],
  },
};

export default nextConfig;
