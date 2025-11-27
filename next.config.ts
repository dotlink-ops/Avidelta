import type { NextConfig } from "next";

const { NEXT_PUBLIC_ENV, NEXT_PUBLIC_SITE_URL, NEXT_PUBLIC_ANALYTICS_ID } =
  process.env;

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_ENV,
    NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_ANALYTICS_ID,
  },
};

export default nextConfig;
