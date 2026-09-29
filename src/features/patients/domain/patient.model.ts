export type PatientStatus = "Active" | "Follow-up" | "Inactive";

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  phone: string;
  email: string;
  blood: string;
  lastVisit: string;
  status: PatientStatus;
  condition: string;
}
