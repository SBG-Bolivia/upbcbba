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

export interface NewApplicationInput {
  id: string;
  name: string;
  email: string;
  department: Department;
  linkedinUrl: string | null;
  cvStoragePath: string;
  cvFileName: string;
}
