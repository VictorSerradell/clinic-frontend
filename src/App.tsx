import React, { useState, useEffect } from "react";
import { HologramCanvas } from "./shared/components/HologramCanvas";
import { AppointmentList } from "./features/appointments/ui/AppointmentList";
import { EventStreamTable } from "./features/kafka-outbox/ui/EventStreamTable";
import {
  Activity,
  Stethoscope,
  Layers,
  ShieldCheck,
  Cpu,
  Calendar,
  Radio,
  CheckCircle2,
  Clock,
  Zap,
  User,
} from "lucide-react";

// Imports de tipos
import type {
  Appointment,
  AppointmentStatus,
} from "./features/appointments/domain/appointment.model";
import type { OutboxEvent } from "./features/kafka-outbox/domain/outbox-event.model";

// Import de clase/instancia
import { webSocketAdapter } from "./core/websocket/websocket.adapter";

const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: "APT-801",
    patientId: "PAT-1001",
    patientName: "Elena Rostova",
    doctor: "Dr. Beatriz Silva",
    specialty: "Cardiología",
    time: "09:00 AM",
    date: "2026-09-29",
    status: "In Consultation",
    room: "Cabina 102",
  },
  {
    id: "APT-802",
    patientId: "PAT-1002",
    patientName: "Carlos Mendoza",
    doctor: "Dr. Alejandro Gomez",
    specialty: "Endocrinología",
    time: "09:30 AM",
    date: "2026-09-29",
    status: "Scheduled",
    room: "Cabina 105",
  },
  {
    id: "APT-803",
    patientId: "PAT-1003",
    patientName: "Sophie Martin",
    doctor: "Dra. Beatriz Silva",
    specialty: "Medicina General",
    time: "10:15 AM",
    date: "2026-09-29",
    status: "Completed",
    room: "Cabina 101",
  },
];

const INITIAL_EVENTS: OutboxEvent[] = [
  {
    id: "evt-9041",
    aggregateType: "APPOINTMENT",
    aggregateId: "APT-801",
    eventType: "APPOINTMENT_STATUS_UPDATED",
    topic: "clinic.appointments",
    payload: {
      appointmentId: "APT-801",
      previousStatus: "Scheduled",
      newStatus: "In Consultation",
      updatedBy: "Dr. Beatriz Silva",
    },
    timestamp: new Date().toLocaleTimeString(),
    latencyMs: 14,
    status: "PROCESSED",
  },
];

export function App() {
  const [appointments, setAppointments] =
    useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [events, setEvents] = useState<OutboxEvent[]>(INITIAL_EVENTS);

  useEffect(() => {
    const wsUrl =
      import.meta.env.VITE_WS_OUTBOX_URL || "ws://localhost:8080/ws/outbox";

    webSocketAdapter.connect(wsUrl);

    const unsubscribe = webSocketAdapter.subscribe((incomingEvent) => {
      setEvents((prev) => [incomingEvent, ...prev]);
    });

    return () => {
      unsubscribe();
      webSocketAdapter.disconnect();
    };
  }, []);

  const handleStatusChange = (id: string, newStatus: AppointmentStatus) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, status: newStatus } : apt)),
    );

    // Simulación de propagación inmediata del evento via Outbox Pattern
    const newEvent: OutboxEvent = {
      id: `evt-${Math.floor(1000 + Math.random() * 9000)}`,
      aggregateType: "APPOINTMENT",
      aggregateId: id,
      eventType: "APPOINTMENT_STATUS_CHANGED",
      topic: "clinic.appointments",
      payload: {
        appointmentId: id,
        newStatus,
        timestamp: new Date().toISOString(),
      },
      timestamp: new Date().toLocaleTimeString(),
      latencyMs: Math.floor(Math.random() * 20) + 8,
      status: "PROCESSED",
    };

    setEvents((prev) => [newEvent, ...prev]);
  };

  const handleManualTrigger = () => {
    const randomApt =
      appointments[Math.floor(Math.random() * appointments.length)];
    handleStatusChange(randomApt.id, "In Consultation");
  };

  return (
    <div className="flex flex-col min-h-screen font-sans bg-slate-50 text-slate-800">
      {/* Top Navbar */}
      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200 px-6 py-3.5 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="p-2 text-white rounded-lg shadow-md bg-sky-600 shadow-sky-600/20">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h1 className="flex items-center gap-2 text-base font-bold tracking-tight text-slate-900">
              CLINIC HEXAGONAL{" "}
              <span className="text-xs px-2 py-0.5 bg-sky-100 text-sky-800 rounded font-mono font-medium">
                v1.0.0
              </span>
            </h1>
            <p className="text-xs text-slate-500">
              Spring Boot / Quarkus • Oracle PL/SQL • Kafka Outbox
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-medium">
          <a
            href="https://github.com/VictorSerradell"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1 bg-slate-900 hover:bg-slate-800 text-slate-100 rounded-full border border-slate-700 transition"
          >
            <User className="w-3.5 h-3.5 text-sky-400" />
            <span>
              By{" "}
              <strong className="font-semibold text-white">
                Victor Serradell
              </strong>
            </span>
          </a>
          <span className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>{" "}
            Kafka Cluster Online
          </span>
          <span className="flex items-center gap-1.5 bg-sky-50 text-sky-700 px-3 py-1 rounded-full border border-sky-200">
            <Cpu className="w-3.5 h-3.5" /> Frontend Hexagonal
          </span>
        </div>
      </header>

      {/* Main Content Dashboard */}
      <main className="flex-1 w-full p-6 mx-auto space-y-6 max-w-7xl">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Hologram Medical Scanner */}
          <div className="flex flex-col items-center justify-center p-5 bg-white border shadow-sm border-slate-200 rounded-xl">
            <div className="flex items-center justify-between w-full mb-3">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Stethoscope className="w-4 h-4 text-sky-600" /> Escáner
                Biométrico (Holo)
              </span>
              <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
                3D RENDER
              </span>
            </div>
            <HologramCanvas scanSpeed={1.2} wireframeOpacity={0.7} />
          </div>

          {/* Agenda de Citas Médicas */}
          <div className="lg:col-span-2">
            <AppointmentList
              appointments={appointments}
              onStatusChange={handleStatusChange}
            />
          </div>
        </div>

        {/* Real-time Outbox Monitor */}
        <EventStreamTable
          events={events}
          onTriggerManualEvent={handleManualTrigger}
        />
      </main>

      {/* Footer */}
      {/* Footer */}
      <footer className="flex items-center justify-between px-6 py-3 text-xs text-center bg-white border-t border-slate-200 text-slate-500">
        <div className="flex items-center gap-2">
          <span>Clinic Hexagonal Architecture &copy; 2026</span>
          <span>•</span>
          <span>
            Developed by{" "}
            <a
              href="https://github.com/VictorSerradell"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold transition text-sky-700 hover:text-sky-900 hover:underline"
            >
              Victor Serradell
            </a>
          </span>
        </div>
        <span className="flex items-center gap-2">
          <Layers className="w-3.5 h-3.5 text-slate-400" /> Ports & Adapters
          React Standard
        </span>
      </footer>
    </div>
  );
}

export default App;
