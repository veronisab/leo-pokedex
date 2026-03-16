import { STAT_COLORS, STAT_LABELS } from "./types";

type StatBarProps = {
  name: string;
  value: number;
};

export default function StatBar({ name, value }: StatBarProps) {
  const pct = Math.min(100, (value / 255) * 100);
  return (
    <div className="stat-row">
      <span className="stat-name">{STAT_LABELS[name] || name}</span>
      <span className="stat-val">{value}</span>
      <div className="stat-bar-bg">
        <div className="stat-bar-fill" style={{ width: `${pct}%`, background: STAT_COLORS[name] || '#ccc' }} />
      </div>
    </div>
  );
}
