import { Flame } from 'lucide-react';
import { Card } from '../ui/Card';

export function StreakCounter({ current, best }: { current: number; best: number }) {
  return (
    <Card>
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-full bg-brand-warning/15" style={{ boxShadow: '0 0 20px rgba(245, 158, 11, 0.3)' }}>
          <Flame size={28} className="text-brand-warning fire-flicker" />
        </div>
        <div>
          <div className="text-2xl font-bold">{current} days</div>
          <div className="text-xs text-text-muted">Current streak · Best: {best}</div>
        </div>
      </div>
    </Card>
  );
}
