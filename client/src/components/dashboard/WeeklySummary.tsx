import { useEffect, useState } from 'react';
import { Dumbbell, Footprints, Moon, Flame } from 'lucide-react';
import { Card } from '../ui/Card';
import { progressApi } from '../../api';
import { useProfileStore } from '../../stores/profileStore';

export function WeeklySummary() {
  const profileId = useProfileStore((s) => s.profileId);
  const [summary, setSummary] = useState<any>(null);

  useEffect(() => {
    if (!profileId) return;
    progressApi.summary(profileId).then(setSummary).catch(() => {});
  }, [profileId]);

  if (!summary) return null;

  const items = [
    { icon: Dumbbell, label: 'Workouts', value: (summary.workouts?.count ?? 0) + (summary.workouts?.cardioSessions ?? 0), color: '#3b82f6' },
    { icon: Footprints, label: 'Avg Steps', value: `${(summary.steps?.average ?? 0).toLocaleString()}`, color: '#10b981' },
    { icon: Moon, label: 'Avg Sleep', value: `${(summary.sleep?.average ?? 0).toFixed(1)}h`, color: '#8b5cf6' },
    { icon: Flame, label: 'Avg Calories', value: Math.round(summary.calories?.average ?? 0), color: '#f59e0b' },
  ];

  return (
    <Card>
      <h3 className="text-sm uppercase tracking-wide text-text-muted mb-4">This Week</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {items.map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="text-center">
            <div className="inline-flex p-2 rounded-xl mb-2" style={{ background: `${color}20` }}>
              <Icon size={18} style={{ color }} />
            </div>
            <div className="text-lg font-bold">{value}</div>
            <div className="text-xs text-text-muted">{label}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}
