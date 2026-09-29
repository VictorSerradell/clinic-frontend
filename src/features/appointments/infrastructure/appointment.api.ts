import type { AppointmentStatus } from "../domain/appointment.model";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1";

export async function updateAppointmentStatusApi(
  id: string,
  status: AppointmentStatus,
): Promise<void> {
  const response = await fetch(`${BASE_URL}/appointments/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    throw new Error(
      `Error al actualizar estado de la cita: ${response.statusText}`,
    );
  }
}
