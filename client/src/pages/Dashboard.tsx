import { useEffect, useRef, useState } from 'react';
import { dashboardApi, streaksApi, waterApi, quoteApi, progressApi } from '../api';
import { useProfileStore } from '../stores/profileStore';
import type { DashboardData, Streaks, Quote } from '../types';
import { Card } from '../components/ui/Card';
import { CalorieRing } from '../components/dashboard/CalorieRing';
import { MacroBars } from '../components/dashboard/MacroBars';
import { WaterTracker } from '../components/dashboard/WaterTracker';
import { StepsCard } from '../components/dashboard/StepsCard';
import { SleepCard } from '../components/dashboard/SleepCard';
import { WorkoutCard } from '../components/dashboard/WorkoutCard';
import { StreakCounter } from '../components/dashboard/StreakCounter';
import { CompletionBar } from '../components/dashboard/CompletionBar';
import { DateNavigator } from '../components/dashboard/DateNavigator';
import { WeeklyWeightCard } from '../components/dashboard/WeeklyWeightCard';
import { ActivityHeatmap } from '../components/dashboard/ActivityHeatmap';
import { DailyGoals } from '../components/dashboard/DailyGoals';
import { WeeklySummary } from '../components/dashboard/WeeklySummary';
import { MealBreakdown } from '../components/dashboard/MealBreakdown';
import { DashboardGrid } from '../components/dashboard/DashboardGrid';
import { GoalCelebration } from '../components/ui/GoalCelebration';
import { AchievementPopup } from '../components/ui/AchievementPopup';
import { Skeleton } from '../components/ui/Skeleton';
import { toast } from '../components/ui/Toast';

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function Dashboard() {
  const profileId = useProfileStore((s) => s.profileId);
  const profile = useProfileStore((s) => s.profile);
  const [date, setDate] = useState(todayStr());
  const [data, setData] = useState<DashboardData | null>(null);
  const [streaks, setStreaks] = useState<Streaks | null>(null);
  const [quote, setQuote] = useState<Quote | null>(null);
  const [weightHistory, setWeightHistory] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [celebrate, setCelebrate] = useState(false);
  const [goalsChecked, setGoalsChecked] = useState(0);
  const [goalsTotal, setGoalsTotal] = useState(0);
  const [unlockedBadge, setUnlockedBadge] = useState<DashboardData['newBadges']>(undefined);
  const prevCompletion = useRef(0);

  const load = async () => {
    if (!profileId) return;
    try {
      const [d, s, q, w] = await Promise.all([
        dashboardApi.get(profileId, date),
        streaksApi.get(profileId),
        quoteApi.get().catch(() => null),
        progressApi.weight(profileId, '1W').catch(() => []),
      ]);
      setData(d);
      setStreaks(s);
      if (q) setQuote(q);
      setWeightHistory(Array.isArray(w) ? w : []);
      if (d.completion === 100 && prevCompletion.current < 100) {
        setCelebrate(true);
        toast.success('100% complete! Amazing work!');
        setTimeout(() => setCelebrate(false), 4000);
      }
      prevCompletion.current = d.completion;
      // Show achievement popup for newly unlocked badges
      if (d.newBadges && d.newBadges.length > 0) {
        setUnlockedBadge(d.newBadges);
      }
    } catch (e: any) {
      setError(e?.response?.data?.error || 'Could not load dashboard');
    }
  };

  useEffect(() => {
    load();
  }, [profileId, date]);

  const logWater = async (amount: number) => {
    if (!profileId) return;
    await waterApi.log(profileId, date, amount);
    toast.success('Water updated!');
    load();
  };

  if (!profileId) return null;
  if (error) return <Card><p className="text-brand-danger">{error}</p></Card>;
  if (!data) return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-9 w-48 mb-2" />
        <Skeleton className="h-4 w-32" />
      </div>
      <Skeleton className="h-12 w-full" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
      </div>
      <Skeleton className="h-32" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Skeleton className="h-48" />
        <Skeleton className="h-48" />
      </div>
    </div>
  );

  const widgets = [
    {
      id: 'calories',
      label: 'Calories',
      defaultSize: 'half' as const,
      node: (
        <CalorieRing
          consumed={data.calories.consumed}
          burned={data.calories.burned}
          target={data.calories.target}
          remaining={data.calories.remaining}
        />
      ),
    },
    {
      id: 'macros',
      label: 'Macros',
      defaultSize: 'half' as const,
      node: <MacroBars protein={data.macros.protein} carbs={data.macros.carbs} fats={data.macros.fats} />,
    },
    {
      id: 'meals',
      label: 'Meals',
      defaultSize: 'full' as const,
      node: <MealBreakdown meals={data.meals} date={date} onChanged={load} />,
    },
    {
      id: 'water',
      label: 'Water',
      defaultSize: 'full' as const,
      node: <WaterTracker amount={data.water.amount} goal={data.water.goal} onLog={logWater} />,
    },
    {
      id: 'steps',
      label: 'Steps',
      defaultSize: 'half' as const,
      node: <StepsCard count={data.steps.count} goal={data.steps.goal} />,
    },
    {
      id: 'sleep',
      label: 'Sleep',
      defaultSize: 'half' as const,
      node: (
        <SleepCard
          hours={data.sleep.hours}
          quality={data.sleep.quality}
          bedtime={data.sleep.bedtime}
          wakeTime={data.sleep.wakeTime}
          goal={data.sleep.goal}
        />
      ),
    },
    {
      id: 'workouts',
      label: 'Workouts',
      defaultSize: 'full' as const,
      node: <WorkoutCard workouts={data.workouts} cardio={data.cardio} />,
    },
    {
      id: 'weight',
      label: 'Weight Trend',
      defaultSize: 'full' as const,
      node: <WeeklyWeightCard history={weightHistory} />,
    },
    {
      id: 'heatmap',
      label: 'Activity Heatmap',
      defaultSize: 'full' as const,
      node: <ActivityHeatmap />,
    },
    {
      id: 'weekly-summary',
      label: 'Weekly Summary',
      defaultSize: 'full' as const,
      node: <WeeklySummary />,
    },
    ...(quote
      ? [
          {
            id: 'quote',
            label: 'Quote',
            defaultSize: 'full' as const,
            node: (
              <Card>
                <p className="italic text-text-secondary">"{quote.text}"</p>
                <p className="text-xs text-text-muted mt-1">— {quote.author}</p>
              </Card>
            ),
          },
        ]
      : []),
  ];

  return (
    <div className="space-y-6">
      <GoalCelebration trigger={celebrate} />
      <AchievementPopup
        badge={unlockedBadge?.[0] ?? null}
        onClose={() => setUnlockedBadge(undefined)}
      />

      <div>
        <h2 className="text-3xl font-bold">Hi, {profile?.name || data.profile.name}</h2>
        <p className="text-text-muted mt-1">Forge your strength.</p>
      </div>

      <DateNavigator date={date} onChange={setDate} />

      {streaks && <StreakCounter current={streaks.currentStreak} best={streaks.bestStreak} />}

      <CompletionBar pct={
        // Backend has 6 activity checks. Treat each custom goal as an additional check.
        goalsTotal > 0
          ? Math.round(
              (Math.round((data.completion / 100) * 6) + goalsChecked) /
              (6 + goalsTotal) * 100
            )
          : data.completion
      } />

      <DailyGoals
        date={date}
        onCompletionChange={(checked, total) => {
          setGoalsChecked(checked);
          setGoalsTotal(total);
        }}
      />

      <DashboardGrid
        widgets={widgets}
        storageKey={`hercules-dashboard-order-${profileId}`}
      />
    </div>
  );
}
