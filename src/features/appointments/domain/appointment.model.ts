import type {
  Appointment,
  AppointmentStatus,
} from "../domain/appointment.model";
export type AppointmentStatus =
  | "Scheduled"
  | "In Consultation"
  | "Completed"
  | "Cancelled";

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctor: string;
  specialty: string;
  time: string;
  date: string;
  status: AppointmentStatus;
  room: string;
}
