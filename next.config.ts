import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: { remotePatterns: [{ protocol: "https", hostname: "tripspuntacana.com", pathname: "/wp-content/uploads/**" }] }
};
export default nextConfig;
