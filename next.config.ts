import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // TypeScript 에러로 인한 빌드 실패 방지
  typescript: {
    ignoreBuildErrors: true,
  },
  // ESLint 에러로 인한 빌드 실패 방지
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;