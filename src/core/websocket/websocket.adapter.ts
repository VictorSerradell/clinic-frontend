import { IWebSocketService, EventCallback } from "./websocket.port";
import { OutboxEvent } from "../../features/kafka-outbox/domain/outbox-event.model";

export class WebSocketOutboxAdapter implements IWebSocketService {
  private socket: WebSocket | null = null;
  private subscribers: Set<EventCallback> = new Set();
  private connected = false;

  connect(url: string): void {
    if (this.socket) return;

    this.socket = new WebSocket(url);

    this.socket.onopen = () => {
      this.connected = true;
      console.log("[WebSocket] Connected to Outbox Event Stream via BFF");
    };

    this.socket.onmessage = (event) => {
      try {
        const outboxEvent: OutboxEvent = JSON.parse(event.data);
        this.subscribers.forEach((callback) => callback(outboxEvent));
      } catch (err) {
        console.error("[WebSocket] Failed to parse OutboxEvent:", err);
      }
    };

    this.socket.onerror = (error) => {
      console.error("[WebSocket] Error in Outbox stream:", error);
    };

    this.socket.onclose = () => {
      this.connected = false;
      this.socket = null;
      console.log("[WebSocket] Disconnected from stream");
    };
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
      this.connected = false;
    }
  }

  subscribe(callback: EventCallback): () => void {
    this.subscribers.add(callback);
    return () => {
      this.subscribers.delete(callback);
    };
  }

  isConnected(): boolean {
    return this.connected;
  }
}

export const webSocketAdapter = new WebSocketOutboxAdapter();
