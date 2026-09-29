import { OutboxEvent } from "../../features/kafka-outbox/domain/outbox-event.model";

export type EventCallback = (event: OutboxEvent) => void;

export interface IWebSocketService {
  connect(url: string): void;
  disconnect(): void;
  subscribe(callback: EventCallback): () => void;
  isConnected(): boolean;
}
