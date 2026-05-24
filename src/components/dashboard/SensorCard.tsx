import type { ReactNode } from "react";

interface Props {
  title: string;
  icon: ReactNode;
  color: string;
  children: ReactNode;
  accent?: string;
}

export function SensorCard({ title, icon, color, children, accent }: Props) {
  return (
    <div
      className="glass-card p-5 transition-all duration-500 hover:-translate-y-0.5 group"
      style={{ ['--tw-shadow-color' as never]: color, boxShadow: `0 0 24px -8px ${color}, inset 0 0 20px -12px ${color}` }}
    >
      {/* scan line */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="absolute inset-x-0 h-px animate-scan" style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />
      </div>
      <div className="flex items-center justify-between mb-4 relative">
        <div className="flex items-center gap-2.5">
          <div
            className="size-9 rounded-lg grid place-items-center border"
            style={{ borderColor: `${color}`, background: `color-mix(in oklab, ${color} 12%, transparent)`, color }}
          >
            {icon}
          </div>
          <div>
            <div className="text-xs font-mono tracking-[0.2em] text-muted-foreground uppercase">{title}</div>
            {accent && <div className="text-[10px] font-mono" style={{ color }}>{accent}</div>}
          </div>
        </div>
        <div className="size-2 rounded-full animate-pulse" style={{ background: color, boxShadow: `0 0 10px ${color}` }} />
      </div>
      <div className="relative">{children}</div>
    </div>
  );
}
