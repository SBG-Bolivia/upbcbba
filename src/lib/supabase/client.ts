/**
 * Server-side Supabase client.
 *
 * Uses the service-role key, which bypasses RLS — this module must NEVER be
 * imported from a client component. All `applications` reads/writes and CV
 * storage operations live behind Next.js route handlers and server components.
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cached: SupabaseClient | null = null;

export function supabase(): SupabaseClient {
  if (cached) return cached;
  const rawUrl = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const rawKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SERVICE_KEY;
  const url = rawUrl?.trim();
  const key = rawKey?.trim();
  if (!url || !key) {
    const diag = {
      SUPABASE_URL: process.env.SUPABASE_URL === undefined
        ? "undef"
        : `len=${process.env.SUPABASE_URL.length}`,
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL === undefined
        ? "undef"
        : `len=${process.env.NEXT_PUBLIC_SUPABASE_URL.length}`,
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY === undefined
        ? "undef"
        : `len=${process.env.SUPABASE_SERVICE_ROLE_KEY.length}`,
      SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_KEY === undefined
        ? "undef"
        : `len=${process.env.SUPABASE_SERVICE_KEY.length}`,
      hasUrl: Boolean(url),
      hasKey: Boolean(key),
      seenSupabaseKeys: Object.keys(process.env).filter((k) =>
        k.includes("SUPABASE")
      ),
    };
    throw new Error(`Supabase not configured — diag=${JSON.stringify(diag)}`);
  }
  cached = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cached;
}

export const APPLICATIONS_BUCKET = "applications-cv";
