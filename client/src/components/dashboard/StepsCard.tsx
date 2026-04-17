import { Footprints } from 'lucide-react';
import { Card } from '../ui/Card';
import { ProgressRing } from '../ui/ProgressRing';
import { AnimatedNumber } from '../ui/AnimatedNumber';

export function StepsCard({ count, goal }: { count: number; goal: number }) {
  return (
    <Card className="flex flex-col items-center">
      <h3 className="text-sm uppercase tracking-wide text-text-muted mb-3">Steps</h3>
      <ProgressRing
        value={count}
        max={goal}
        size={140}
        stroke={12}
        color="#10b981"
        label={count.toLocaleString()}
        sublabel={`of ${goal.toLocaleString()}`}
      />
      <div className="flex items-center gap-2 mt-3 text-xs text-text-muted">
        <Footprints size={14} /> {Math.round((count / goal) * 100)}% of goal
      </div>
    </Card>
  );
}
