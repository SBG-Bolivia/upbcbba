import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    SBG_SUPABASE_URL:
      process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    SBG_SUPABASE_SERVICE_KEY:
      process.env.SUPABASE_SERVICE_ROLE_KEY ??
      process.env.SUPABASE_SERVICE_KEY ??
      "",
  },
};

export default nextConfig;
