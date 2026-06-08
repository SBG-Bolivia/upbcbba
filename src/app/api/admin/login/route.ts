import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  ADMIN_COOKIE_OPTIONS,
  checkPassword,
  mintAdminCookie,
} from "@/lib/admin/auth";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as { password?: string } | null;
  if (!body?.password) {
    return NextResponse.json({ error: "missing password" }, { status: 400 });
  }
  const ok = await checkPassword(body.password);
  if (!ok) {
    return NextResponse.json({ error: "invalid" }, { status: 401 });
  }
  const value = await mintAdminCookie();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, value, ADMIN_COOKIE_OPTIONS);
  return res;
}
