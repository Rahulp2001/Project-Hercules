import { Dumbbell } from 'lucide-react';
import { Card } from '../ui/Card';
import type { Workout, Cardio } from '../../types';

export function WorkoutCard({ workouts, cardio }: { workouts: Workout[]; cardio: Cardio[] }) {
  const totalWorkouts = workouts.length;
  const totalCardioMin = cardio.reduce((s, c) => s + (c.duration || 0), 0);

  return (
    <Card>
      <h3 className="text-sm uppercase tracking-wide text-text-muted mb-3 flex items-center gap-2">
        <Dumbbell size={14} /> Training
      </h3>
      {totalWorkouts === 0 && totalCardioMin === 0 ? (
        <p className="text-text-muted text-sm">No training logged yet today.</p>
      ) : (
        <div className="space-y-2">
          {workouts.map((w) => (
            <div key={w.id} className="flex justify-between items-center bg-bg-elevated rounded-lg p-3">
              <div>
                <div className="font-medium text-sm">{w.name}</div>
                <div className="text-xs text-text-muted">{w.exercises.length} exercises</div>
              </div>
              {w.duration && <div className="text-xs text-text-muted">{w.duration} min</div>}
            </div>
          ))}
          {totalCardioMin > 0 && (
            <div className="flex justify-between items-center bg-bg-elevated rounded-lg p-3">
              <div className="text-sm font-medium">Cardio</div>
              <div className="text-xs text-text-muted">{totalCardioMin} min</div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
