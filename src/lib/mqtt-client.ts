import mqtt, { type MqttClient } from "mqtt";
import { useEffect, useRef, useState } from "react";

export interface SensorData {
  temperature: number;
  humidity: number;
  air: number;
  light: number;
  soil: number;
  led: number;
}

export type ConnStatus = "connecting" | "connected" | "reconnecting" | "error" | "offline";

const BROKER = "wss://bfd5753d33614601949e918d4c43d793.s1.eu.hivemq.cloud:8884/mqtt";
const TOPIC = "casita/domo";

export function useMqtt() {
  const [status, setStatus] = useState<ConnStatus>("connecting");
  const [data, setData] = useState<SensorData | null>(null);
  const [history, setHistory] = useState<Array<SensorData & { t: number }>>([]);
  const [lastUpdate, setLastUpdate] = useState<number | null>(null);
  const clientRef = useRef<MqttClient | null>(null);

  useEffect(() => {
    const client = mqtt.connect(BROKER, {
      username: "esp32",
      password: "casitaDOMO123@",
      clean: true,
      reconnectPeriod: 3000,
      connectTimeout: 10000,
    });
    clientRef.current = client;

    client.on("connect", () => {
      setStatus("connected");
      client.subscribe(TOPIC);
    });
    client.on("reconnect", () => setStatus("reconnecting"));
    client.on("offline", () => setStatus("offline"));
    client.on("error", () => setStatus("error"));
    client.on("message", (_topic, payload) => {
      try {
        const parsed = JSON.parse(payload.toString()) as SensorData;
        setData(parsed);
        setLastUpdate(Date.now());
        setHistory((prev) => [...prev.slice(-29), { ...parsed, t: Date.now() }]);
      } catch (e) {
        console.error("Bad MQTT payload", e);
      }
    });

    return () => {
      client.end(true);
    };
  }, []);

  return { status, data, history, lastUpdate };
}
