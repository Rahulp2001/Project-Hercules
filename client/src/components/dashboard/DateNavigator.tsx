import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  date: string; // YYYY-MM-DD
  onChange: (date: string) => void;
}

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function format(date: string) {
  const d = new Date(date + 'T00:00:00');
  const today = todayStr();
  const yest = new Date(Date.now() - 86400000);
  const yestStr = `${yest.getFullYear()}-${String(yest.getMonth() + 1).padStart(2, '0')}-${String(yest.getDate()).padStart(2, '0')}`;
  if (date === today) return 'Today';
  if (date === yestStr) return 'Yesterday';
  return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
}

function shift(date: string, days: number): string {
  const d = new Date(date + 'T00:00:00');
  d.setDate(d.getDate() + days);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function DateNavigator({ date, onChange }: Props) {
  const today = todayStr();
  const isToday = date === today;
  return (
    <div className="flex items-center justify-between bg-bg-card rounded-2xl p-3" style={{ border: '1px solid rgb(var(--border) / var(--border-alpha))' }}>
      <button
        onClick={() => onChange(shift(date, -1))}
        className="p-2 rounded-lg hover:bg-bg-elevated text-text-secondary hover:text-brand-primary transition-colors"
      >
        <ChevronLeft size={20} />
      </button>
      <div className="text-center">
        <div className="font-bold">{format(date)}</div>
        {!isToday && (
          <button onClick={() => onChange(today)} className="text-xs text-brand-primary hover:underline">
            Jump to today
          </button>
        )}
      </div>
      <button
        onClick={() => !isToday && onChange(shift(date, 1))}
        disabled={isToday}
        className="p-2 rounded-lg hover:bg-bg-elevated text-text-secondary hover:text-brand-primary transition-colors disabled:opacity-30 disabled:hover:text-text-secondary"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
