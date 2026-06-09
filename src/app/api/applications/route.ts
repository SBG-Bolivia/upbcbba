import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import {
  DEPARTMENTS,
  deleteCv,
  insertApplication,
  uploadCv,
  type Department,
} from "@/lib/supabase/applications";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const MAX_CV_BYTES = 5 * 1024 * 1024;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function bad(error: string, status = 400) {
  return NextResponse.json({ error }, { status });
}

export async function POST(req: Request) {
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return bad("Esperábamos un formulario multipart.", 415);
  }

  const name = String(form.get("name") ?? "").trim();
  const email = String(form.get("email") ?? "").trim();
  const departmentRaw = String(form.get("department") ?? "").trim();
  const linkedinRaw = String(form.get("linkedinUrl") ?? "").trim();
  const cv = form.get("cv");

  if (!name) return bad("El nombre es obligatorio.");
  if (!EMAIL_RE.test(email)) return bad("El correo no es válido.");
  if (!DEPARTMENTS.includes(departmentRaw as Department))
    return bad("Equipo no válido.");
  const department = departmentRaw as Department;

  let linkedinUrl: string | null = null;
  if (linkedinRaw) {
    try {
      const u = new URL(linkedinRaw);
      if (!/(^|\.)linkedin\.com$/.test(u.hostname))
        return bad("El link debe ser de linkedin.com.");
      linkedinUrl = u.toString();
    } catch {
      return bad("El link de LinkedIn no es válido.");
    }
  }

  if (!(cv instanceof File)) return bad("Falta el archivo CV.");
  if (cv.type !== "application/pdf") return bad("El CV debe ser un PDF.");
  if (cv.size === 0) return bad("El CV está vacío.");
  if (cv.size > MAX_CV_BYTES)
    return bad("El CV no puede pesar más de 5 MB.");

  const id = randomUUID();
  const bytes = new Uint8Array(await cv.arrayBuffer());

  let storagePath: string;
  try {
    storagePath = await uploadCv(id, bytes);
  } catch (e) {
    const err = e as { name?: string; message?: string; statusCode?: string | number; status?: number };
    console.error("[applications] upload failed", e);
    return NextResponse.json(
      {
        error: "No pudimos guardar el CV. Intentá más tarde.",
        debug: {
          name: err?.name ?? null,
          message: err?.message ?? null,
          statusCode: err?.statusCode ?? err?.status ?? null,
          supabaseUrlHost: (() => {
            const u = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
            try { return new URL(u).host; } catch { return u ? "invalid-url" : "missing"; }
          })(),
          serviceKeyPresent: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SERVICE_KEY),
          serviceKeyLen: (process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SERVICE_KEY ?? "").length,
          envSampleKeys: Object.keys(process.env).filter((k) => /^(SUPABASE|SBG|ADMIN|NEXT_PUBLIC)/.test(k)).sort(),
        },
      },
      { status: 500 }
    );
  }

  try {
    await insertApplication({
      id,
      name,
      email,
      department,
      linkedinUrl,
      cvStoragePath: storagePath,
      cvFileName: cv.name || `${id}.pdf`,
    });
  } catch (e) {
    console.error("[applications] insert failed", e);
    await deleteCv(storagePath).catch((err) =>
      console.error("[applications] orphan cleanup failed", err)
    );
    return bad("No pudimos registrar tu postulación. Intentá más tarde.", 500);
  }

  return NextResponse.json({ ok: true, id });
}
