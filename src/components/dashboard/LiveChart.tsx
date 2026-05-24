import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface Props {
  data: Array<Record<string, number>>;
  series: { key: string; color: string; label: string }[];
}

export function LiveChart({ data, series }: Props) {
  const formatted = data.map((d) => ({
    ...d,
    time: new Date(d.t).toLocaleTimeString([], { minute: "2-digit", second: "2-digit" }),
  }));
  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={formatted} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            {series.map((s) => (
              <linearGradient key={s.key} id={`grad-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={s.color} stopOpacity={0.6} />
                <stop offset="100%" stopColor={s.color} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>
          <XAxis dataKey="time" stroke="oklch(0.70 0.04 240)" fontSize={10} tickLine={false} axisLine={false} />
          <YAxis stroke="oklch(0.70 0.04 240)" fontSize={10} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{
              background: "oklch(0.16 0.03 260 / 0.95)",
              border: "1px solid oklch(0.85 0.18 200 / 0.3)",
              borderRadius: 12,
              fontFamily: "monospace",
              fontSize: 12,
            }}
          />
          {series.map((s) => (
            <Area
              key={s.key}
              type="monotone"
              dataKey={s.key}
              name={s.label}
              stroke={s.color}
              strokeWidth={2}
              fill={`url(#grad-${s.key})`}
              isAnimationActive={false}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
