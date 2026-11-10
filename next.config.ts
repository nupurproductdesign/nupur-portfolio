import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false, // hide the Next.js dev badge so local matches production
  async redirects() {
    // the gallery used to live at /gallery before it became the homepage (2026-11-10)
    return [{ source: "/gallery", destination: "/", permanent: false }];
  },
};

export default nextConfig;
