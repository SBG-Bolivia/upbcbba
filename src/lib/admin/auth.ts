import { cookies } from "next/headers";

export const ADMIN_COOKIE = "sbg_admin";
const TTL_SECONDS = 60 * 60 * 24 * 7;

function getSecret(): string {
  const s = process.env.ADMIN_PASSWORD;
  if (!s) throw new Error("ADMIN_PASSWORD env var is not set");
  return s;
}

async function hmacHex(secret: string, msg: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(msg));
  return [...new Uint8Array(sig)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function checkPassword(input: string): Promise<boolean> {
  return constantTimeEqual(input, getSecret());
}

export async function mintAdminCookie(): Promise<string> {
  const expiry = Math.floor(Date.now() / 1000) + TTL_SECONDS;
  const sig = await hmacHex(getSecret(), String(expiry));
  return `${expiry}.${sig}`;
}

export async function verifyAdminCookie(
  value: string | undefined | null
): Promise<boolean> {
  if (!value) return false;
  const dot = value.indexOf(".");
  if (dot < 0) return false;
  const expiry = value.slice(0, dot);
  const sig = value.slice(dot + 1);
  const expiryNum = Number(expiry);
  if (!Number.isFinite(expiryNum) || expiryNum < Date.now() / 1000) return false;
  let secret: string;
  try {
    secret = getSecret();
  } catch {
    return false;
  }
  const expected = await hmacHex(secret, expiry);
  return constantTimeEqual(sig, expected);
}

export async function requireAdmin(): Promise<void> {
  const c = await cookies();
  const ok = await verifyAdminCookie(c.get(ADMIN_COOKIE)?.value);
  if (!ok) throw new Response("Unauthorized", { status: 401 });
}

export const ADMIN_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: TTL_SECONDS,
};
