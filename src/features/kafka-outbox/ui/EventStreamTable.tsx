import React, { useState } from "react";
import type { OutboxEvent } from "../domain/outbox-event.model";
import {
  Database,
  Radio,
  CheckCircle2,
  Zap,
  Clock,
  Terminal,
} from "lucide-react";

interface EventStreamTableProps {
  events: OutboxEvent[];
  onTriggerManualEvent?: () => void;
}

export const EventStreamTable: React.FC<EventStreamTableProps> = ({
  events,
  onTriggerManualEvent,
}) => {
  const [selectedEvent, setSelectedEvent] = useState<OutboxEvent | null>(null);

  return (
    <div className="p-5 font-mono text-xs border shadow-xl bg-slate-900 border-slate-800 text-slate-100 rounded-xl">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
          <h2 className="text-sm font-bold tracking-wide text-slate-200">
            CDC Transactional Outbox Stream (Kafka)
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-slate-400 bg-slate-800 px-2.5 py-1 rounded border border-slate-700">
            Topic: <span className="text-sky-400">clinic.events</span>
          </span>
          {onTriggerManualEvent && (
            <button
              onClick={onTriggerManualEvent}
              className="flex items-center gap-1.5 bg-sky-600 hover:bg-sky-500 text-white px-3 py-1 rounded transition text-xs font-sans font-medium"
            >
              <Zap className="w-3.5 h-3.5" /> Simular Cambio PL/SQL
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Tabla de Eventos */}
        <div className="overflow-x-auto overflow-y-auto lg:col-span-2 max-h-80">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="px-2 py-2">Timestamp</th>
                <th className="px-2 py-2">Evento</th>
                <th className="px-2 py-2">Aggregate</th>
                <th className="px-2 py-2">Latencia</th>
                <th className="px-2 py-2 text-right">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {events.map((evt) => (
                <tr
                  key={evt.id}
                  onClick={() => setSelectedEvent(evt)}
                  className={`hover:bg-slate-800/80 cursor-pointer transition ${
                    selectedEvent?.id === evt.id
                      ? "bg-sky-950/50 text-sky-200"
                      : "text-slate-300"
                  }`}
                >
                  <td className="px-2 py-2 text-slate-400">{evt.timestamp}</td>
                  <td className="px-2 py-2 font-semibold text-emerald-400">
                    {evt.eventType}
                  </td>
                  <td className="px-2 py-2 text-slate-300">
                    {evt.aggregateType}#{evt.aggregateId}
                  </td>
                  <td className="flex items-center gap-1 px-2 py-2 text-amber-400/90">
                    <Clock className="w-3 h-3" /> {evt.latencyMs}ms
                  </td>
                  <td className="px-2 py-2 text-right">
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800">
                      <CheckCircle2 className="w-2.5 h-2.5" /> {evt.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Visor de Payload JSON */}
        <div className="flex flex-col justify-between p-3 border rounded-lg bg-slate-950 border-slate-800">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2 text-slate-400 text-[11px]">
              <span className="flex items-center gap-1">
                <Terminal className="w-3.5 h-3.5 text-sky-400" /> Payload Event
                Detail
              </span>
              <span>
                {selectedEvent ? selectedEvent.id : "Ningún evento selec."}
              </span>
            </div>
            <pre className="text-[11px] text-sky-300 bg-slate-900/80 p-2.5 rounded border border-slate-800/80 overflow-x-auto max-h-56 leading-relaxed">
              {selectedEvent
                ? JSON.stringify(selectedEvent.payload, null, 2)
                : "// Haz clic en una fila de evento para inspeccionar el payload propagado por el Outbox Pattern."}
            </pre>
          </div>
          <div className="text-[10px] text-slate-500 mt-2 flex items-center justify-between border-t border-slate-900 pt-2">
            <span>Fuente: Oracle Trigger PL/SQL</span>
            <span className="text-emerald-500">Kafka Sink OK</span>
          </div>
        </div>
      </div>
    </div>
  );
};
