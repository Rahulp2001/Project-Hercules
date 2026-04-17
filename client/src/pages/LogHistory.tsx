import { useEffect, useState } from 'react';
import { Trash2, UtensilsCrossed, Dumbbell, Heart } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { mealsApi, workoutsApi, cardioApi } from '../api';
import { useProfileStore } from '../stores/profileStore';
import { toast } from '../components/ui/Toast';

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function LogHistory() {
  const profileId = useProfileStore((s) => s.profileId);
  const [date] = useState(todayStr());
  const [meals, setMeals] = useState<any[]>([]);
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [cardio, setCardio] = useState<any[]>([]);

  const load = async () => {
    if (!profileId) return;
    const [m, w, c] = await Promise.all([
      mealsApi.getByDate(profileId, date),
      workoutsApi.getByDate(profileId, date),
      cardioApi.getByDate(profileId, date),
    ]);
    setMeals(m);
    setWorkouts(w);
    setCardio(c);
  };

  useEffect(() => { load(); }, [profileId]);

  const deleteMeal = async (id: number) => {
    await mealsApi.delete(id);
    toast.success('Meal removed');
    load();
  };

  const deleteWorkout = async (id: number) => {
    await workoutsApi.delete(id);
    toast.success('Workout removed');
    load();
  };

  const deleteCardio = async (id: number) => {
    await cardioApi.delete(id);
    toast.success('Cardio removed');
    load();
  };

  const totalCals = meals.reduce((s, m) => s + m.calories, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Today's Log</h2>
        <p className="text-text-muted mt-1">Review and delete entries.</p>
      </div>

      {/* Meals */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <UtensilsCrossed size={16} className="text-brand-primary" />
          <h3 className="font-bold">Meals</h3>
          <span className="ml-auto text-xs text-text-muted">{Math.round(totalCals)} kcal total</span>
        </div>
        {meals.length === 0 ? (
          <p className="text-text-muted text-sm">No meals logged today.</p>
        ) : (
          <div className="space-y-2">
            {meals.map((m) => (
              <div key={m.id} className="flex items-center justify-between bg-bg-elevated rounded-xl px-4 py-3">
                <div>
                  <div className="font-medium text-sm capitalize">{m.name}</div>
                  <div className="text-xs text-text-muted">{m.category} · {m.calories} kcal · P:{m.protein}g C:{m.carbs}g F:{m.fats}g</div>
                </div>
                <button onClick={() => deleteMeal(m.id)} className="p-2 text-text-muted hover:text-brand-danger transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Workouts */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Dumbbell size={16} className="text-brand-secondary" />
          <h3 className="font-bold">Workouts</h3>
        </div>
        {workouts.length === 0 ? (
          <p className="text-text-muted text-sm">No workouts logged today.</p>
        ) : (
          <div className="space-y-2">
            {workouts.map((w) => (
              <div key={w.id} className="flex items-center justify-between bg-bg-elevated rounded-xl px-4 py-3">
                <div>
                  <div className="font-medium text-sm">{w.name}</div>
                  <div className="text-xs text-text-muted">{w.exercises?.length || 0} exercises{w.duration ? ` · ${w.duration} min` : ''}</div>
                </div>
                <button onClick={() => deleteWorkout(w.id)} className="p-2 text-text-muted hover:text-brand-danger transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Cardio */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Heart size={16} className="text-brand-danger" />
          <h3 className="font-bold">Cardio</h3>
        </div>
        {cardio.length === 0 ? (
          <p className="text-text-muted text-sm">No cardio logged today.</p>
        ) : (
          <div className="space-y-2">
            {cardio.map((c) => (
              <div key={c.id} className="flex items-center justify-between bg-bg-elevated rounded-xl px-4 py-3">
                <div>
                  <div className="font-medium text-sm capitalize">{c.activityType}</div>
                  <div className="text-xs text-text-muted">{c.duration} min{c.distance ? ` · ${c.distance} km` : ''}{c.caloriesBurned ? ` · ${Math.round(c.caloriesBurned)} kcal` : ''}</div>
                </div>
                <button onClick={() => deleteCardio(c.id)} className="p-2 text-text-muted hover:text-brand-danger transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
