export type EventTopic =
  | "clinic.appointments"
  | "clinic.patients"
  | "clinic.medical-records"
  | "clinic.billing";
export type EventStatus = "PROCESSED" | "PENDING" | "FAILED";

export interface OutboxEvent {
  id: string;
  aggregateType: string;
  aggregateId: string;
  eventType: string;
  topic: EventTopic;
  payload: Record<string, unknown>;
  timestamp: string;
  latencyMs: number;
  status: EventStatus;
}
