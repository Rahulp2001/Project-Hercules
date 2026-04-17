import { TrendingDown, TrendingUp, Minus } from 'lucide-react';
import { Card } from '../ui/Card';

interface Entry { date: string; weight: number; }

export function WeeklyWeightCard({ history }: { history: Entry[] }) {
  if (!history || history.length === 0) {
    return (
      <Card>
        <h3 className="text-sm uppercase tracking-wide text-text-muted mb-2">Weekly Avg Weight</h3>
        <p className="text-text-muted text-sm">Log your weight to see your trend.</p>
      </Card>
    );
  }

  const avg = history.reduce((s, e) => s + e.weight, 0) / history.length;
  const first = history[0].weight;
  const last = history[history.length - 1].weight;
  const change = last - first;
  const Icon = change > 0.05 ? TrendingUp : change < -0.05 ? TrendingDown : Minus;
  const color = change > 0.05 ? '#ef4444' : change < -0.05 ? '#10b981' : '#a1a1aa';

  return (
    <Card>
      <h3 className="text-sm uppercase tracking-wide text-text-muted mb-2">Weekly Avg Weight</h3>
      <div className="flex items-end gap-3">
        <div className="text-3xl font-bold">{avg.toFixed(1)}<span className="text-sm text-text-muted font-normal"> kg</span></div>
        <div className="flex items-center gap-1 text-sm font-medium pb-1" style={{ color }}>
          <Icon size={16} />
          {change > 0 ? '+' : ''}{change.toFixed(1)} kg
        </div>
      </div>
      <div className="text-xs text-text-muted mt-1">{history.length} entries this week</div>
    </Card>
  );
}
