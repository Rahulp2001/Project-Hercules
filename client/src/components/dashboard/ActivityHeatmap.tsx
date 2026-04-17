import { useEffect, useState } from 'react';
import { Card } from '../ui/Card';
import { progressApi } from '../../api';
import { useProfileStore } from '../../stores/profileStore';

function getPast12Weeks() {
  const days: string[] = [];
  const today = new Date();
  for (let i = 83; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    days.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`);
  }
  return days;
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function ActivityHeatmap() {
  const profileId = useProfileStore((s) => s.profileId);
  const [completionMap, setCompletionMap] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!profileId) return;
    progressApi.completion(profileId, '3M').then((data: any[]) => {
      const map: Record<string, number> = {};
      (data || []).forEach((d: any) => { map[d.date] = d.completion ?? 0; });
      setCompletionMap(map);
    }).catch(() => {});
  }, [profileId]);

  const days = getPast12Weeks();
  const today = days[days.length - 1];

  const getColor = (date: string) => {
    const pct = completionMap[date] ?? -1;
    if (pct < 0) return 'bg-bg-elevated';
    if (pct === 0) return 'bg-bg-elevated';
    if (pct < 30) return 'bg-brand-primary/20';
    if (pct < 60) return 'bg-brand-primary/40';
    if (pct < 90) return 'bg-brand-primary/70';
    return 'bg-brand-primary';
  };

  // Pad start so first day aligns to correct weekday
  const firstDow = new Date(days[0] + 'T00:00:00').getDay();
  const padded = [...Array(firstDow).fill(null), ...days];

  return (
    <Card>
      <div className="flex justify-between items-center mb-3">
        <div>
          <h3 className="text-sm uppercase tracking-wide text-text-muted">Activity</h3>
          <p className="text-xs text-text-muted mt-0.5">Last 12 weeks · each square = 1 day</p>
        </div>
        <div className="flex items-center gap-1 text-xs text-text-muted">
          <span>Less</span>
          {['bg-bg-elevated', 'bg-brand-primary/20', 'bg-brand-primary/40', 'bg-brand-primary/70', 'bg-brand-primary'].map((c, i) => (
            <div key={i} className={`w-3 h-3 rounded-sm ${c}`} />
          ))}
          <span>More</span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <div className="flex gap-1" style={{ minWidth: 'max-content' }}>
          {/* Day labels */}
          <div className="flex flex-col gap-1 mr-1">
            {DAYS.map((d) => (
              <div key={d} className="h-3 text-[9px] text-text-muted w-6 flex items-center">{d}</div>
            ))}
          </div>
          {/* Grid by week columns */}
          {Array.from({ length: Math.ceil(padded.length / 7) }, (_, wi) => (
            <div key={wi} className="flex flex-col gap-1">
              {Array.from({ length: 7 }, (_, di) => {
                const date = padded[wi * 7 + di];
                if (!date) return <div key={di} className="w-3 h-3" />;
                const isToday = date === today;
                return (
                  <div
                    key={di}
                    title={`${date}: ${completionMap[date] ?? 0}%`}
                    className={`w-3 h-3 rounded-sm transition-all ${getColor(date)} ${isToday ? 'ring-1 ring-brand-primary' : ''}`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
