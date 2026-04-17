import { useState, useEffect } from 'react';
import { Plus, Check, Trash2, Target } from 'lucide-react';
import { Card } from '../ui/Card';
import { targetsApi } from '../../api';
import { useProfileStore } from '../../stores/profileStore';
import { toast } from '../ui/Toast';

interface Props {
  date: string;
  onCompletionChange?: (checked: number, total: number) => void;
}

function getCheckedKey(profileId: number, date: string) {
  return `hercules-goals-checked-${profileId}-${date}`;
}

export function DailyGoals({ date, onCompletionChange }: Props) {
  const profileId = useProfileStore((s) => s.profileId);
  const [goals, setGoals] = useState<any[]>([]);
  const [checked, setChecked] = useState<Set<number>>(new Set());
  const [adding, setAdding] = useState(false);
  const [newGoal, setNewGoal] = useState('');

  const loadGoals = async () => {
    if (!profileId) return;
    const data = await targetsApi.getAll(profileId);
    setGoals(data);
  };

  const loadChecked = () => {
    if (!profileId) return;
    try {
      const stored = localStorage.getItem(getCheckedKey(profileId, date));
      setChecked(stored ? new Set(JSON.parse(stored)) : new Set());
    } catch {
      setChecked(new Set());
    }
  };

  useEffect(() => {
    loadGoals();
    loadChecked();
  }, [profileId, date]);

  useEffect(() => {
    const activeGoals = goals.filter((g) => g.isActive);
    onCompletionChange?.(checked.size, activeGoals.length);
  }, [checked, goals]);

  const toggle = (id: number) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      if (profileId) localStorage.setItem(getCheckedKey(profileId, date), JSON.stringify(Array.from(next)));
      return next;
    });
  };

  const addGoal = async () => {
    if (!profileId || !newGoal.trim()) return;
    await targetsApi.create(profileId, newGoal.trim());
    setNewGoal('');
    setAdding(false);
    toast.success('Goal added!');
    loadGoals();
  };

  const deleteGoal = async (id: number) => {
    await targetsApi.delete(id);
    setChecked((prev) => { const n = new Set(prev); n.delete(id); return n; });
    toast.success('Goal removed');
    loadGoals();
  };

  const activeGoals = goals.filter((g) => g.isActive);

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm uppercase tracking-wide text-text-muted flex items-center gap-2">
          <Target size={14} /> Daily Goals
        </h3>
        <span className="text-xs text-brand-primary font-bold">
          {checked.size}/{activeGoals.length} done
        </span>
      </div>

      <div className="space-y-2">
        {activeGoals.length === 0 && (
          <p className="text-text-muted text-sm">No goals yet. Add one below.</p>
        )}
        {activeGoals.map((g) => {
          const done = checked.has(g.id);
          return (
            <div key={g.id} className="flex items-center gap-3">
              <button
                onClick={() => toggle(g.id)}
                className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all shrink-0 ${
                  done ? 'bg-brand-primary border-brand-primary shadow-glow' : 'border-text-muted/30'
                }`}
              >
                {done && <Check size={14} className="text-white" />}
              </button>
              <span className={`flex-1 text-sm transition-all ${done ? 'line-through text-text-muted' : 'text-text-primary'}`}>
                {g.name}
              </span>
              <button onClick={() => deleteGoal(g.id)} className="text-text-muted hover:text-brand-danger transition-colors">
                <Trash2 size={14} />
              </button>
            </div>
          );
        })}
      </div>

      {adding ? (
        <div className="flex gap-2 mt-3">
          <input
            autoFocus
            className="input flex-1 text-sm"
            placeholder="e.g. Drink green tea"
            value={newGoal}
            onChange={(e) => setNewGoal(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') addGoal(); if (e.key === 'Escape') setAdding(false); }}
          />
          <button onClick={addGoal} className="px-3 py-2 bg-brand-primary text-white rounded-xl text-sm">Add</button>
          <button onClick={() => setAdding(false)} className="px-3 py-2 bg-bg-elevated text-text-muted rounded-xl text-sm">✕</button>
        </div>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="flex items-center gap-2 mt-3 text-sm text-brand-primary hover:text-brand-primary/80 transition-colors"
        >
          <Plus size={16} /> Add goal
        </button>
      )}
    </Card>
  );
}
