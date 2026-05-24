interface Props {
  value: number;
  min?: number;
  max?: number;
  unit?: string;
  color: string; // css color var like "var(--cyan)"
  label: string;
}

export function Gauge({ value, min = 0, max = 100, unit = "", color, label }: Props) {
  const pct = Math.max(0, Math.min(1, (value - min) / (max - min)));
  const size = 160;
  const stroke = 12;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  // 3/4 arc
  const arcLen = c * 0.75;
  const dash = arcLen * pct;
  const rotate = 135;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-0">
        <defs>
          <filter id={`glow-${label}`}>
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <g transform={`rotate(${rotate} ${size / 2} ${size / 2})`}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="oklch(0.85 0.18 200 / 0.12)"
            strokeWidth={stroke}
            strokeDasharray={`${arcLen} ${c}`}
            strokeLinecap="round"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeDasharray={`${dash} ${c}`}
            strokeLinecap="round"
            filter={`url(#glow-${label})`}
            style={{ transition: "stroke-dasharray 0.8s cubic-bezier(.4,0,.2,1)" }}
          />
        </g>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-3xl font-bold font-mono tabular-nums text-glow" style={{ color }}>
          {Math.round(value)}
          <span className="text-sm ml-0.5 opacity-70">{unit}</span>
        </div>
        <div className="text-[10px] font-mono tracking-[0.25em] text-muted-foreground mt-1">{label}</div>
      </div>
    </div>
  );
}
