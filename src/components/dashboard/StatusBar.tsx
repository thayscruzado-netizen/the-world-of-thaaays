import type { ConnStatus } from "@/lib/mqtt-client";
import { Activity, Wifi, WifiOff, Loader2, AlertTriangle } from "lucide-react";

const map: Record<ConnStatus, { label: string; color: string; Icon: typeof Wifi }> = {
  connected: { label: "LIVE", color: "text-neon", Icon: Wifi },
  connecting: { label: "CONNECTING", color: "text-warn", Icon: Loader2 },
  reconnecting: { label: "RECONNECTING", color: "text-warn", Icon: Loader2 },
  offline: { label: "OFFLINE", color: "text-muted-foreground", Icon: WifiOff },
  error: { label: "ERROR", color: "text-danger", Icon: AlertTriangle },
};

export function StatusBar({ status, lastUpdate }: { status: ConnStatus; lastUpdate: number | null }) {
  const s = map[status];
  const spin = status === "connecting" || status === "reconnecting" ? "animate-spin" : "";
  return (
    <div className="glass-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-5 py-4">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className={`size-2.5 rounded-full ${status === "connected" ? "bg-neon" : "bg-muted-foreground"}`}>
            {status === "connected" && (
              <span className="absolute inset-0 rounded-full bg-neon animate-ping opacity-75" />
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <s.Icon className={`size-4 ${s.color} ${spin}`} />
          <span className={`text-xs font-mono tracking-[0.2em] ${s.color} text-glow`}>{s.label}</span>
        </div>
        <span className="hidden sm:inline text-muted-foreground/60 text-xs font-mono">/ MQTT://hivemq.cloud</span>
      </div>
      <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
        <Activity className="size-3.5 text-cyan" />
        <span>LAST PACKET:</span>
        <span className="text-foreground">{lastUpdate ? new Date(lastUpdate).toLocaleTimeString() : "—"}</span>
      </div>
    </div>
  );
}
