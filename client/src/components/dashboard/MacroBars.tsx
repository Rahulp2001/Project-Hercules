import { Card } from '../ui/Card';

interface MacroProps {
  protein: { consumed: number; target: number };
  carbs: { consumed: number; target: number };
  fats: { consumed: number; target: number };
}

function Bar({ label, consumed, target, color }: { label: string; consumed: number; target: number; color: string }) {
  const pct = Math.min(100, target > 0 ? (consumed / target) * 100 : 0);
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-text-secondary font-medium">{label}</span>
        <span className="text-text-muted">
          {Math.round(consumed)} / {Math.round(target)}g
        </span>
      </div>
      <div className="h-2 bg-bg-elevated rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: color, boxShadow: `0 0 10px ${color}80` }}
        />
      </div>
    </div>
  );
}

export function MacroBars({ protein, carbs, fats }: MacroProps) {
  return (
    <Card>
      <h3 className="text-sm uppercase tracking-wide text-text-muted mb-4">Macros</h3>
      <div className="space-y-4">
        <Bar label="Protein" consumed={protein.consumed} target={protein.target} color="#8b5cf6" />
        <Bar label="Carbs" consumed={carbs.consumed} target={carbs.target} color="#3b82f6" />
        <Bar label="Fats" consumed={fats.consumed} target={fats.target} color="#f59e0b" />
      </div>
    </Card>
  );
}
