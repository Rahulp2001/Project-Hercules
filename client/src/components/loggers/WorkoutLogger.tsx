import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { workoutsApi } from '../../api';
import { useProfileStore } from '../../stores/profileStore';

interface SetRow { reps: string; weight: string; }
interface ExRow { name: string; category: string; sets: SetRow[]; }

interface Props {
  open: boolean;
  onClose: () => void;
  date: string;
  onSaved: () => void;
}

const CATEGORIES = ['Chest', 'Back', 'Shoulders', 'Arms', 'Legs', 'Core', 'Full Body', 'Other'];

export function WorkoutLogger({ open, onClose, date, onSaved }: Props) {
  const profileId = useProfileStore((s) => s.profileId);
  const [name, setName] = useState('');
  const [duration, setDuration] = useState('');
  const [exercises, setExercises] = useState<ExRow[]>([
    { name: '', category: 'Chest', sets: [{ reps: '', weight: '' }] },
  ]);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const addExercise = () =>
    setExercises((e) => [...e, { name: '', category: 'Chest', sets: [{ reps: '', weight: '' }] }]);
  const removeExercise = (i: number) => setExercises((e) => e.filter((_, idx) => idx !== i));
  const updateExercise = (i: number, patch: Partial<ExRow>) =>
    setExercises((e) => e.map((ex, idx) => (idx === i ? { ...ex, ...patch } : ex)));
  const addSet = (i: number) =>
    setExercises((e) =>
      e.map((ex, idx) => (idx === i ? { ...ex, sets: [...ex.sets, { reps: '', weight: '' }] } : ex))
    );
  const removeSet = (i: number, si: number) =>
    setExercises((e) =>
      e.map((ex, idx) => (idx === i ? { ...ex, sets: ex.sets.filter((_, j) => j !== si) } : ex))
    );
  const updateSet = (i: number, si: number, patch: Partial<SetRow>) =>
    setExercises((e) =>
      e.map((ex, idx) =>
        idx === i ? { ...ex, sets: ex.sets.map((s, j) => (j === si ? { ...s, ...patch } : s)) } : ex
      )
    );

  const save = async () => {
    if (!profileId || !name.trim()) return;
    setSaving(true);
    setSaveError(null);
    try {
      await workoutsApi.create({
        profileId,
        date,
        name: name.trim(),
        duration: duration ? Number(duration) : undefined,
        exercises: exercises
          .filter((ex) => ex.name.trim())
          .map((ex, sortOrder) => {
            const validSets = ex.sets.filter((s) => s.reps && s.weight);
            // Ensure at least one set even if user left fields empty
            const sets = validSets.length > 0 ? validSets : [{ reps: ex.sets[0]?.reps || '1', weight: ex.sets[0]?.weight || '0' }];
            return {
              name: ex.name.trim(),
              category: ex.category,
              sortOrder,
              sets: sets.map((s, so) => ({
                reps: Number(s.reps) || 1,
                weight: Number(s.weight) || 0,
                type: 'normal' as const,
                sortOrder: so,
              })),
            };
          }),
      });
      setName(''); setDuration('');
      setExercises([{ name: '', category: 'Chest', sets: [{ reps: '', weight: '' }] }]);
      onSaved();
      onClose();
    } catch (e: any) {
      setSaveError(e?.response?.data?.error || e?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Log Workout">
      <div className="space-y-4">
        <Input label="Workout name" placeholder="Push Day" value={name} onChange={(e) => setName(e.target.value)} />
        <Input label="Duration (min)" type="number" placeholder="60" value={duration} onChange={(e) => setDuration(e.target.value)} />

        <div className="space-y-3">
          {exercises.map((ex, i) => (
            <div key={i} className="bg-bg-elevated rounded-xl p-3 space-y-2">
              <div className="flex gap-2">
                <input
                  className="input flex-1"
                  placeholder="Exercise name"
                  value={ex.name}
                  onChange={(e) => updateExercise(i, { name: e.target.value })}
                />
                <button onClick={() => removeExercise(i)} className="px-3 text-text-muted hover:text-brand-danger">
                  <Trash2 size={16} />
                </button>
              </div>
              <select
                className="input"
                value={ex.category}
                onChange={(e) => updateExercise(i, { category: e.target.value })}
              >
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
              {ex.sets.map((s, si) => (
                <div key={si} className="flex gap-2 items-center">
                  <span className="text-xs text-text-muted w-6">#{si + 1}</span>
                  <input
                    className="input flex-1"
                    placeholder="Reps"
                    type="number"
                    value={s.reps}
                    onChange={(e) => updateSet(i, si, { reps: e.target.value })}
                  />
                  <input
                    className="input flex-1"
                    placeholder="Weight (kg)"
                    type="number"
                    value={s.weight}
                    onChange={(e) => updateSet(i, si, { weight: e.target.value })}
                  />
                  <button onClick={() => removeSet(i, si)} className="text-text-muted hover:text-brand-danger px-2">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              <button onClick={() => addSet(i)} className="text-xs text-brand-primary flex items-center gap-1">
                <Plus size={14} /> Add set
              </button>
            </div>
          ))}
          <Button variant="secondary" onClick={addExercise} className="w-full">
            <Plus size={16} className="inline mr-1" /> Add Exercise
          </Button>
        </div>

        {saveError && <p className="text-brand-danger text-sm">{saveError}</p>}
        <Button onClick={save} disabled={saving || !name.trim()} className="w-full">
          {saving ? 'Saving...' : 'Save Workout'}
        </Button>
      </div>
    </Modal>
  );
}
