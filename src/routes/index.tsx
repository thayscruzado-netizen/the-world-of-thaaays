import { createFileRoute } from "@tanstack/react-router";
import { useMqtt } from "@/lib/mqtt-client";
import { StatusBar } from "@/components/dashboard/StatusBar";
import { SensorCard } from "@/components/dashboard/SensorCard";
import { Gauge } from "@/components/dashboard/Gauge";
import { ProgressBar } from "@/components/dashboard/ProgressBar";
import { LiveChart } from "@/components/dashboard/LiveChart";
import { Thermometer, Droplets, Wind, Sun, Lightbulb, Sprout, Leaf, Cpu } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Dashboard,
  head: () => ({
    meta: [
      { title: "Casita Domo Thay — Live IoT Dashboard" },
      { name: "description", content: "Real-time smart-home IoT dashboard streaming live sensor data from ESP32 via MQTT." },
    ],
  }),
});

const CYAN = "oklch(0.85 0.18 200)";
const NEON = "oklch(0.86 0.22 150)";
const MAGENTA = "oklch(0.75 0.24 330)";
const WARN = "oklch(0.82 0.18 80)";
const DANGER = "oklch(0.68 0.24 25)";

function soilStatus(v: number): { label: string; color: string } {
  // ESP32 capacitive soil: lower = wet, higher = dry. Common range ~1500-3500
  if (v >= 2800) return { label: "DRY", color: DANGER };
  if (v >= 2000) return { label: "HUMID", color: NEON };
  return { label: "WET", color: CYAN };
}

function airQuality(v: number): { label: string; color: string } {
  if (v < 1500) return { label: "CLEAN", color: NEON };
  if (v < 2500) return { label: "MODERATE", color: WARN };
  return { label: "POOR", color: DANGER };
}

function Dashboard() {
  const { status, data, history, lastUpdate } = useMqtt();

  const empty = !data;
  const d = data ?? { temperature: 0, humidity: 0, air: 0, light: 0, soil: 0, led: 0 };
  const soil = soilStatus(d.soil);
  const air = airQuality(d.air);
  const ledOn = d.led === 1;

  return (
    <div className="min-h-screen grid-bg">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8 space-y-6">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono tracking-[0.3em] text-cyan text-glow mb-2">
              <Cpu className="size-3.5" />
              <span>SMART · HOME · OS</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-cyan via-foreground to-accent bg-clip-text text-transparent">
                Casita Domo Thay
              </span>
            </h1>
            <p className="text-muted-foreground text-sm mt-1 font-mono">
              Live ESP32 telemetry · <span className="text-cyan">casita/domo</span>
            </p>
          </div>
        </header>

        <StatusBar status={status} lastUpdate={lastUpdate} />

        {empty && status !== "connected" && (
          <div className="glass-card p-8 text-center">
            <p className="text-muted-foreground font-mono text-sm">Awaiting first packet from broker…</p>
          </div>
        )}

        {/* ENVIRONMENT */}
        <section>
          <SectionTitle index="01" title="Environment" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SensorCard title="Temperature" icon={<Thermometer className="size-4" />} color={MAGENTA} accent={`${d.temperature}°C`}>
              <div className="flex justify-center py-2">
                <Gauge value={d.temperature} min={0} max={50} unit="°C" color={MAGENTA} label="TEMP" />
              </div>
            </SensorCard>

            <SensorCard title="Humidity" icon={<Droplets className="size-4" />} color={CYAN} accent={`${d.humidity}%`}>
              <div className="flex justify-center py-2">
                <Gauge value={d.humidity} min={0} max={100} unit="%" color={CYAN} label="HUM" />
              </div>
            </SensorCard>

            <SensorCard title="Air Quality" icon={<Wind className="size-4" />} color={air.color} accent={air.label}>
              <div className="flex justify-center py-2">
                <Gauge value={d.air} min={0} max={4095} unit="" color={air.color} label="AQI" />
              </div>
              <div className="mt-2 text-center text-[10px] font-mono tracking-[0.25em]" style={{ color: air.color }}>
                STATUS · {air.label}
              </div>
            </SensorCard>
          </div>
        </section>

        {/* LIGHT */}
        <section>
          <SectionTitle index="02" title="Light System" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <SensorCard title="Light Level" icon={<Sun className="size-4" />} color={WARN} accent={`${d.light} lux`}>
                <div className="space-y-4 pt-2">
                  <ProgressBar value={d.light} max={4095} color={WARN} label="Ambient" unit="" />
                  <div className="text-xs font-mono text-muted-foreground">
                    Raw ADC value from LDR sensor · 0 (dark) → 4095 (bright)
                  </div>
                </div>
              </SensorCard>
            </div>

            <SensorCard
              title="LED State"
              icon={<Lightbulb className="size-4" />}
              color={ledOn ? WARN : "oklch(0.55 0.04 260)"}
              accent={ledOn ? "ACTIVE" : "OFF"}
            >
              <div className="flex flex-col items-center justify-center py-4 gap-3">
                <div
                  className="relative size-24 rounded-full grid place-items-center transition-all duration-500"
                  style={{
                    background: ledOn
                      ? `radial-gradient(circle, ${WARN}, transparent 70%)`
                      : "radial-gradient(circle, oklch(0.30 0.02 260), transparent 70%)",
                  }}
                >
                  <Lightbulb
                    className={`size-12 transition-all duration-500 ${ledOn ? "animate-pulse" : ""}`}
                    style={{
                      color: ledOn ? WARN : "oklch(0.45 0.02 260)",
                      filter: ledOn ? `drop-shadow(0 0 12px ${WARN})` : "none",
                    }}
                  />
                </div>
                <div
                  className="font-mono text-sm tracking-[0.3em] text-glow"
                  style={{ color: ledOn ? WARN : "oklch(0.55 0.04 260)" }}
                >
                  {ledOn ? "● ON" : "○ OFF"}
                </div>
              </div>
            </SensorCard>
          </div>
        </section>

        {/* PLANT */}
        <section>
          <SectionTitle index="03" title="Plant Monitoring" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SensorCard title="Soil Moisture" icon={<Sprout className="size-4" />} color={soil.color} accent={String(d.soil)}>
              <div className="flex justify-center py-2">
                <Gauge value={4095 - d.soil} min={0} max={4095} unit="" color={soil.color} label="MOISTURE" />
              </div>
            </SensorCard>

            <SensorCard title="Soil Condition" icon={<Leaf className="size-4" />} color={soil.color} accent={soil.label}>
              <div className="flex flex-col items-center justify-center py-6 gap-4">
                <div
                  className="text-4xl font-bold font-mono tracking-[0.2em] text-glow"
                  style={{ color: soil.color }}
                >
                  {soil.label}
                </div>
                <div className="flex gap-2">
                  {["WET", "HUMID", "DRY"].map((l) => {
                    const active = l === soil.label;
                    return (
                      <div
                        key={l}
                        className="px-3 py-1 rounded-full border text-[10px] font-mono tracking-widest transition-all"
                        style={{
                          borderColor: active ? soil.color : "oklch(0.35 0.06 260 / 0.5)",
                          color: active ? soil.color : "oklch(0.55 0.04 260)",
                          background: active ? `color-mix(in oklab, ${soil.color} 14%, transparent)` : "transparent",
                          boxShadow: active ? `0 0 12px ${soil.color}` : "none",
                        }}
                      >
                        {l}
                      </div>
                    );
                  })}
                </div>
              </div>
            </SensorCard>

            <SensorCard title="Raw Reading" icon={<Cpu className="size-4" />} color={CYAN} accent="ADC">
              <div className="space-y-3 pt-2">
                <ProgressBar value={d.soil} max={4095} color={CYAN} label="Sensor" unit="" />
                <div className="text-[10px] font-mono text-muted-foreground leading-relaxed">
                  Capacitive probe · lower values indicate higher water saturation.
                </div>
              </div>
            </SensorCard>
          </div>
        </section>

        {/* CHARTS */}
        <section>
          <SectionTitle index="04" title="Real-Time Telemetry" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="glass-card p-5">
              <div className="text-xs font-mono tracking-[0.2em] text-muted-foreground uppercase mb-4">
                Temperature · Humidity
              </div>
              <LiveChart
                data={history}
                series={[
                  { key: "temperature", color: MAGENTA, label: "Temp °C" },
                  { key: "humidity", color: CYAN, label: "Hum %" },
                ]}
              />
            </div>
            <div className="glass-card p-5">
              <div className="text-xs font-mono tracking-[0.2em] text-muted-foreground uppercase mb-4">
                Air · Light · Soil
              </div>
              <LiveChart
                data={history}
                series={[
                  { key: "air", color: NEON, label: "Air" },
                  { key: "light", color: WARN, label: "Light" },
                  { key: "soil", color: MAGENTA, label: "Soil" },
                ]}
              />
            </div>
          </div>
        </section>

        <footer className="pt-6 pb-4 text-center text-[10px] font-mono tracking-[0.25em] text-muted-foreground">
          CASITA DOMO THAY · ESP32 × HiveMQ · v1.0
        </footer>
      </div>
    </div>
  );
}

function SectionTitle({ index, title }: { index: string; title: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="font-mono text-xs text-cyan text-glow">{index}</div>
      <div className="h-px flex-1 bg-gradient-to-r from-cyan/60 to-transparent" />
      <h2 className="text-sm font-mono tracking-[0.3em] uppercase text-muted-foreground">{title}</h2>
      <div className="h-px flex-1 bg-gradient-to-l from-accent/60 to-transparent" />
    </div>
  );
}
