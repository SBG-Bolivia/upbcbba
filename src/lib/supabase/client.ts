/**
 * Server-side Supabase client.
 *
 * Uses the service-role key, which bypasses RLS — this module must NEVER be
 * imported from a client component. All `applications` reads/writes and CV
 * storage operations live behind Next.js route handlers and server components.
 *
 * SBG_SUPABASE_* are populated by `next.config.ts` `env` at build time from
 * SUPABASE_URL/NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY/
 * SUPABASE_SERVICE_KEY. This avoids relying on the Amplify SSR Lambda runtime
 * env, which doesn't see Amplify Console vars.
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cached: SupabaseClient | null = null;

export function supabase(): SupabaseClient {
  if (cached) return cached;
  const url = process.env.SBG_SUPABASE_URL?.trim();
  const key = process.env.SBG_SUPABASE_SERVICE_KEY?.trim();
  if (!url || !key) {
    throw new Error(
      "Supabase not configured — set SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL) and SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_SERVICE_KEY) in the build environment"
    );
  }
  cached = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cached;
}

export const APPLICATIONS_BUCKET = "applications-cv";
