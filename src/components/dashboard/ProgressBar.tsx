interface Props {
  value: number;
  max: number;
  color: string;
  label?: string;
  unit?: string;
}

export function ProgressBar({ value, max, color, label, unit }: Props) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className="w-full">
      <div className="flex justify-between mb-2 text-xs font-mono">
        <span className="text-muted-foreground tracking-widest uppercase">{label}</span>
        <span className="tabular-nums text-glow" style={{ color }}>
          {Math.round(value)}{unit} <span className="text-muted-foreground/60">/ {max}</span>
        </span>
      </div>
      <div className="h-2 rounded-full overflow-hidden bg-[oklch(0.85_0.18_200/0.08)] border border-[oklch(0.85_0.18_200/0.15)] relative">
        <div
          className="h-full rounded-full relative transition-all duration-700 ease-out"
          style={{
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${color}, color-mix(in oklab, ${color} 50%, white))`,
            boxShadow: `0 0 12px ${color}, 0 0 4px ${color} inset`,
          }}
        >
          <div className="absolute inset-0 opacity-50" style={{
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
            animation: "scan 2s linear infinite",
          }} />
        </div>
      </div>
    </div>
  );
}
