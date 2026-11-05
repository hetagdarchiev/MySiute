import type { NextConfig } from "next";
const config: NextConfig = {
  output: process.platform === "win32" ? undefined : "standalone",
  poweredByHeader: false,
  turbopack: { root: process.cwd() },
};
export default config;
