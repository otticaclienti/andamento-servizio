import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/andamento-servizio",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
