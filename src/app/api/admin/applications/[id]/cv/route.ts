import { NextResponse } from "next/server";
import {
  getApplication,
  getCvSignedUrl,
} from "@/lib/supabase/applications";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface Ctx {
  params: Promise<{ id: string }>;
}

export async function GET(_req: Request, { params }: Ctx) {
  const { id } = await params;
  let app;
  try {
    app = await getApplication(id);
  } catch (e) {
    console.error("[admin/applications/cv GET] lookup", e);
    return NextResponse.json(
      { error: "Error al buscar la postulación." },
      { status: 500 }
    );
  }
  if (!app) {
    return NextResponse.json(
      { error: "Postulación no encontrada." },
      { status: 404 }
    );
  }
  try {
    const url = await getCvSignedUrl(app.cvStoragePath);
    return NextResponse.json({ url, fileName: app.cvFileName });
  } catch (e) {
    console.error("[admin/applications/cv GET] sign", e);
    return NextResponse.json(
      { error: "No se pudo generar el link." },
      { status: 500 }
    );
  }
}
