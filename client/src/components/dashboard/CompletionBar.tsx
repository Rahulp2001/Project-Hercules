import { Card } from '../ui/Card';

export function CompletionBar({ pct }: { pct: number }) {
  return (
    <Card>
      <div className="flex justify-between mb-2">
        <h3 className="text-sm uppercase tracking-wide text-text-muted">Daily Completion</h3>
        <span className="text-sm font-bold text-brand-primary">{Math.round(pct)}%</span>
      </div>
      <div className="h-3 bg-bg-elevated rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${pct}%`,
            background: 'linear-gradient(90deg, #8b5cf6, #3b82f6)',
            boxShadow: '0 0 15px rgba(139, 92, 246, 0.5)',
          }}
        />
      </div>
    </Card>
  );
}
