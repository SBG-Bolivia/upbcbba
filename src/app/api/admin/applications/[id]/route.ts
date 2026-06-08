import { NextResponse } from "next/server";
import {
  APPLICATION_STATUSES,
  setApplicationStatus,
  type ApplicationStatus,
} from "@/lib/supabase/applications";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface Ctx {
  params: Promise<{ id: string }>;
}

export async function PATCH(req: Request, { params }: Ctx) {
  const { id } = await params;
  const body = (await req.json().catch(() => null)) as
    | { status?: string }
    | null;
  const status = body?.status as ApplicationStatus | undefined;
  if (!status || !APPLICATION_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Estado inválido." }, { status: 400 });
  }
  try {
    await setApplicationStatus(id, status);
  } catch (e) {
    console.error("[admin/applications PATCH]", e);
    return NextResponse.json(
      { error: "No se pudo actualizar." },
      { status: 500 }
    );
  }
  return NextResponse.json({ ok: true });
}
