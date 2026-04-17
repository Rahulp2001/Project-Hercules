import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UtensilsCrossed, Dumbbell, Heart, Moon, Footprints, Scale, ClipboardList } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { FoodLogger } from '../components/loggers/FoodLogger';
import { WorkoutLogger } from '../components/loggers/WorkoutLogger';
import { CardioLogger } from '../components/loggers/CardioLogger';
import { QuickLogger } from '../components/loggers/QuickLogger';
import { toast } from '../components/ui/Toast';

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

type Open = null | 'food' | 'workout' | 'cardio' | 'sleep' | 'steps' | 'weight';

export function Log() {
  const [open, setOpen] = useState<Open>(null);
  const navigate = useNavigate();
  const date = todayStr();
  const close = () => setOpen(null);

  const items = [
    { key: 'food', label: 'Food', icon: UtensilsCrossed, color: '#8b5cf6' },
    { key: 'workout', label: 'Workout', icon: Dumbbell, color: '#3b82f6' },
    { key: 'cardio', label: 'Cardio', icon: Heart, color: '#ef4444' },
    { key: 'sleep', label: 'Sleep', icon: Moon, color: '#a855f7' },
    { key: 'steps', label: 'Steps', icon: Footprints, color: '#10b981' },
    { key: 'weight', label: 'Weight', icon: Scale, color: '#f59e0b' },
  ] as const;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Log</h2>
        <p className="text-text-muted mt-1">What did you do today?</p>
      </div>

      <button onClick={() => navigate('/log/history')} className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-bg-elevated hover:bg-brand-primary/10 text-text-secondary hover:text-brand-primary transition-all">
        <ClipboardList size={18} />
        <span className="font-medium">View & Edit Today's Log</span>
      </button>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {items.map(({ key, label, icon: Icon, color }) => (
          <button key={key} onClick={() => setOpen(key)} className="text-left">
            <Card className="hover:scale-[1.02] transition-transform">
              <div className="p-3 rounded-xl inline-flex mb-3" style={{ background: `${color}25`, boxShadow: `0 0 20px ${color}40` }}>
                <Icon size={24} style={{ color }} />
              </div>
              <div className="font-bold">{label}</div>
              <div className="text-xs text-text-muted">Tap to log</div>
            </Card>
          </button>
        ))}
      </div>

      <FoodLogger open={open === 'food'} onClose={close} date={date} onSaved={() => toast.success('Meal logged!')} />
      <WorkoutLogger open={open === 'workout'} onClose={close} date={date} onSaved={() => toast.success('Workout saved!')} />
      <CardioLogger open={open === 'cardio'} onClose={close} date={date} onSaved={() => toast.success('Cardio logged!')} />
      {(open === 'sleep' || open === 'steps' || open === 'weight') && (
        <QuickLogger
          open={true}
          kind={open}
          onClose={close}
          date={date}
          onSaved={() => toast.success(`${open.charAt(0).toUpperCase() + open.slice(1)} logged!`)}
        />
      )}
    </div>
  );
}
