import React, { useState } from "react";
import { Appointment, AppointmentStatus } from "../domain/appointment.model";
import {
  Calendar,
  Clock,
  User,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  XCircle,
} from "lucide-react";

interface AppointmentListProps {
  appointments: Appointment[];
  onStatusChange: (id: string, newStatus: AppointmentStatus) => void;
}

const statusBadges: Record<
  AppointmentStatus,
  { label: string; color: string; icon: React.ReactNode }
> = {
  Scheduled: {
    label: "Programada",
    color: "bg-amber-50 text-amber-700 border-amber-200",
    icon: <Clock className="w-3.5 h-3.5" />,
  },
  "In Consultation": {
    label: "En Consulta",
    color: "bg-sky-50 text-sky-700 border-sky-200 animate-pulse",
    icon: <RefreshCw className="w-3.5 h-3.5" />,
  },
  Completed: {
    label: "Completada",
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
  },
  Cancelled: {
    label: "Cancelada",
    color: "bg-rose-50 text-rose-700 border-rose-200",
    icon: <XCircle className="w-3.5 h-3.5" />,
  },
};

export const AppointmentList: React.FC<AppointmentListProps> = ({
  appointments,
  onStatusChange,
}) => {
  const [filter, setFilter] = useState<string>("ALL");

  const filtered =
    filter === "ALL"
      ? appointments
      : appointments.filter((a) => a.status === filter);

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-sky-600" />
          <h2 className="text-lg font-semibold text-slate-800">
            Agenda Médica del Día
          </h2>
        </div>
        <div className="flex gap-1 bg-slate-100 p-1 rounded-lg text-xs font-medium text-slate-600">
          {["ALL", "Scheduled", "In Consultation", "Completed"].map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`px-3 py-1 rounded-md transition-colors ${
                filter === st
                  ? "bg-white text-slate-900 shadow-sm font-semibold"
                  : "hover:text-slate-900"
              }`}
            >
              {st === "ALL" ? "Todas" : st}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((apt) => {
          const badge = statusBadges[apt.status];
          return (
            <div
              key={apt.id}
              className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200/80 rounded-lg hover:border-slate-300 transition"
            >
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-center justify-center bg-white px-3 py-2 rounded-lg border border-slate-200">
                  <span className="text-xs font-bold text-slate-700">
                    {apt.time}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {apt.room}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-800 text-sm">
                      {apt.patientName}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      ({apt.patientId})
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3 text-slate-400" /> {apt.doctor}
                    </span>
                    <span>•</span>
                    <span className="text-sky-700 font-medium">
                      {apt.specialty}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${badge.color}`}
                >
                  {badge.icon}
                  {badge.label}
                </span>

                <select
                  value={apt.status}
                  onChange={(e) =>
                    onStatusChange(apt.id, e.target.value as AppointmentStatus)
                  }
                  className="text-xs bg-white border border-slate-300 rounded-md px-2 py-1 text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value="Scheduled">Programada</option>
                  <option value="In Consultation">En Consulta</option>
                  <option value="Completed">Completada</option>
                  <option value="Cancelled">Cancelada</option>
                </select>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
