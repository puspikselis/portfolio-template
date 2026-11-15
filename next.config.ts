import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  experimental: {
    // TypeScript 7 has no JS compiler API; invoke the native tsc CLI instead.
    useTypeScriptCli: true,
  },
};

export default nextConfig;
