import { useState } from 'react';
import { Coffee, Sun, Moon, Cookie, Plus, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from '../ui/Card';
import { FoodLogger } from '../loggers/FoodLogger';
import { mealsApi } from '../../api';
import { toast } from '../ui/Toast';
import type { Meal, DashboardData } from '../../types';

type Category = 'breakfast' | 'lunch' | 'dinner' | 'snacks';

const categories: { key: Category; label: string; icon: typeof Coffee; color: string }[] = [
  { key: 'breakfast', label: 'Breakfast', icon: Coffee, color: '#f59e0b' },
  { key: 'lunch',     label: 'Lunch',     icon: Sun,    color: '#3b82f6' },
  { key: 'dinner',    label: 'Dinner',    icon: Moon,   color: '#8b5cf6' },
  { key: 'snacks',    label: 'Snacks',    icon: Cookie, color: '#10b981' },
];

interface Props {
  meals: DashboardData['meals'];
  date: string;
  onChanged: () => void;
}

export function MealBreakdown({ meals, date, onChanged }: Props) {
  const [openCategory, setOpenCategory] = useState<Category | null>(null);

  const deleteMeal = async (id: number) => {
    await mealsApi.delete(id);
    toast.success('Meal removed');
    onChanged();
  };

  const totalKcal = categories.reduce(
    (sum, c) => sum + (meals[c.key] ?? []).reduce((s, m) => s + m.calories, 0), 0
  );

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm uppercase tracking-wide text-text-muted">Meals</h3>
        <span className="text-xs text-text-secondary font-semibold">{Math.round(totalKcal)} kcal total</span>
      </div>

      <div className="space-y-3">
        {categories.map(({ key, label, icon: Icon, color }) => {
          const items: Meal[] = meals[key] ?? [];
          const catKcal = items.reduce((s, m) => s + m.calories, 0);

          return (
            <div key={key} className="rounded-xl p-3" style={{ background: `${color}08`, border: `1px solid ${color}18` }}>
              {/* Category header */}
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg" style={{ background: `${color}20` }}>
                    <Icon size={14} style={{ color }} />
                  </div>
                  <span className="text-sm font-semibold">{label}</span>
                  {items.length > 0 && (
                    <span className="text-xs text-text-muted">{Math.round(catKcal)} kcal</span>
                  )}
                </div>
                <button
                  onClick={() => setOpenCategory(key)}
                  className="p-1.5 rounded-lg transition-all hover:scale-110"
                  style={{ background: `${color}20`, color }}
                  title={`Add ${label}`}
                >
                  <Plus size={14} />
                </button>
              </div>

              {/* Meal items */}
              {items.length === 0 ? (
                <p className="text-xs text-text-muted pl-9">Nothing logged</p>
              ) : (
                <motion.div
                  className="space-y-1 mt-1"
                  initial="hidden"
                  animate="visible"
                  variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.04 } } }}
                >
                  {items.map((meal) => (
                    <motion.div
                      key={meal.id}
                      variants={{ hidden: { opacity: 0, x: -8 }, visible: { opacity: 1, x: 0 } }}
                      className="flex items-center gap-2 pl-9 group"
                    >
                      <span className="flex-1 text-xs text-text-secondary truncate">{meal.name}</span>
                      <span className="text-xs font-medium text-text-primary shrink-0">{Math.round(meal.calories)}</span>
                      <button
                        onClick={() => deleteMeal(meal.id)}
                        className="opacity-0 group-hover:opacity-100 text-text-muted hover:text-brand-danger transition-all p-0.5"
                      >
                        <Trash2 size={12} />
                      </button>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
          );
        })}
      </div>

      <FoodLogger
        open={!!openCategory}
        onClose={() => setOpenCategory(null)}
        date={date}
        defaultCategory={openCategory ?? undefined}
        onSaved={() => { setOpenCategory(null); onChanged(); }}
      />
    </Card>
  );
}
