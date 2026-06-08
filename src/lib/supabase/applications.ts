/**
 * Data + storage layer for the job-applications feature.
 *
 * - Rows live in `public.applications` (Postgres).
 * - CV PDFs live in Storage bucket `applications-cv` under `{id}.pdf`.
 * Everything goes through the service-role client — never import from a
 * client component.
 */

import { APPLICATIONS_BUCKET, supabase } from "./client";

export type Department = "marketing" | "it" | "dev" | "eventos";
export type ApplicationStatus =
  | "pending"
  | "contacted"
  | "hired"
  | "rejected";

export const DEPARTMENTS: Department[] = ["marketing", "it", "dev", "eventos"];
export const APPLICATION_STATUSES: ApplicationStatus[] = [
  "pending",
  "contacted",
  "hired",
  "rejected",
];

export const DEPARTMENT_LABELS: Record<Department, string> = {
  marketing: "Marketing / Redes Sociales",
  it: "IT Support",
  dev: "Dev Team",
  eventos: "Relaciones / Eventos",
};

export const STATUS_LABELS: Record<ApplicationStatus, string> = {
  pending: "Pendiente",
  contacted: "Contactado",
  hired: "Aceptado",
  rejected: "Rechazado",
};

export interface JobApplication {
  id: string;
  name: string;
  email: string;
  department: Department;
  linkedinUrl: string | null;
  cvStoragePath: string;
  cvFileName: string;
  status: ApplicationStatus;
  notes: string | null;
  submittedAt: string;
}

interface ApplicationRow {
  id: string;
  name: string;
  email: string;
  department: Department;
  linkedin_url: string | null;
  cv_storage_path: string;
  cv_file_name: string;
  status: ApplicationStatus;
  notes: string | null;
  submitted_at: string;
}

function fromRow(r: ApplicationRow): JobApplication {
  return {
    id: r.id,
    name: r.name,
    email: r.email,
    department: r.department,
    linkedinUrl: r.linkedin_url,
    cvStoragePath: r.cv_storage_path,
    cvFileName: r.cv_file_name,
    status: r.status,
    notes: r.notes,
    submittedAt: r.submitted_at,
  };
}

export interface NewApplicationInput {
  id: string;
  name: string;
  email: string;
  department: Department;
  linkedinUrl: string | null;
  cvStoragePath: string;
  cvFileName: string;
}

export async function insertApplication(
  input: NewApplicationInput
): Promise<JobApplication> {
  const { data, error } = await supabase()
    .from("applications")
    .insert({
      id: input.id,
      name: input.name,
      email: input.email,
      department: input.department,
      linkedin_url: input.linkedinUrl,
      cv_storage_path: input.cvStoragePath,
      cv_file_name: input.cvFileName,
    })
    .select("*")
    .single<ApplicationRow>();
  if (error) throw error;
  return fromRow(data);
}

export async function listApplications(
  department?: Department
): Promise<JobApplication[]> {
  let q = supabase()
    .from("applications")
    .select("*")
    .order("submitted_at", { ascending: false });
  if (department) q = q.eq("department", department);
  const { data, error } = await q.returns<ApplicationRow[]>();
  if (error) throw error;
  return (data ?? []).map(fromRow);
}

export async function getApplication(
  id: string
): Promise<JobApplication | null> {
  const { data, error } = await supabase()
    .from("applications")
    .select("*")
    .eq("id", id)
    .maybeSingle<ApplicationRow>();
  if (error) throw error;
  return data ? fromRow(data) : null;
}

export async function setApplicationStatus(
  id: string,
  status: ApplicationStatus
): Promise<void> {
  const { error } = await supabase()
    .from("applications")
    .update({ status })
    .eq("id", id);
  if (error) throw error;
}

/** Uploads the CV PDF. Returns the storage path. */
export async function uploadCv(
  id: string,
  bytes: Uint8Array
): Promise<string> {
  const path = `${id}.pdf`;
  const { error } = await supabase()
    .storage.from(APPLICATIONS_BUCKET)
    .upload(path, bytes, {
      contentType: "application/pdf",
      upsert: false,
    });
  if (error) throw error;
  return path;
}

/** Best-effort cleanup if the row insert fails after a successful upload. */
export async function deleteCv(path: string): Promise<void> {
  await supabase().storage.from(APPLICATIONS_BUCKET).remove([path]);
}

/** Short-lived signed URL so an admin can download the CV. */
export async function getCvSignedUrl(
  path: string,
  expiresInSeconds = 300
): Promise<string> {
  const { data, error } = await supabase()
    .storage.from(APPLICATIONS_BUCKET)
    .createSignedUrl(path, expiresInSeconds);
  if (error) throw error;
  return data.signedUrl;
}
