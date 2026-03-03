import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/dentalscan",
        destination: "https://dentalscan.us",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;