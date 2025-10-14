import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ["192.168.100.3"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "wof-flourishing-backup.s3.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "*",
      },
      {
        protocol: "https",
        hostname: "cdn.iconscout.com",
      },
      {
        protocol: "https",
        hostname: "1000logos.net",
      },
      {
        protocol: "https",
        hostname: "d17wy07434ngk.cloudfront.net",
      },
    ],
  },
};

export default nextConfig;
