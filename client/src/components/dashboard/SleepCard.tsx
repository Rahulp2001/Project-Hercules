import { Moon } from 'lucide-react';
import { Card } from '../ui/Card';

interface Props {
  hours: number;
  quality: string | null;
  bedtime: string | null;
  wakeTime: string | null;
  goal: number;
}

export function SleepCard({ hours, quality, bedtime, wakeTime, goal }: Props) {
  const pct = Math.min(100, goal > 0 ? (hours / goal) * 100 : 0);
  return (
    <Card>
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm uppercase tracking-wide text-text-muted flex items-center gap-2">
          <Moon size={14} /> Sleep
        </h3>
        {quality && <span className="text-xs text-brand-primary capitalize">{quality}</span>}
      </div>
      <div className="text-3xl font-bold">
        {hours}h <span className="text-sm text-text-muted font-normal">/ {goal}h</span>
      </div>
      <div className="h-2 bg-bg-elevated rounded-full overflow-hidden mt-3">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: '#8b5cf6', boxShadow: '0 0 10px #8b5cf680' }}
        />
      </div>
      {(bedtime || wakeTime) && (
        <div className="text-xs text-text-muted mt-2">
          {bedtime || '--'} → {wakeTime || '--'}
        </div>
      )}
    </Card>
  );
}
