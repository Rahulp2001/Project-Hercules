import { useEffect, useState } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import { Trophy, TrendingUp, TrendingDown } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { progressApi, achievementsApi } from '../api';
import { useProfileStore } from '../stores/profileStore';
import type { Achievement } from '../types';

type Range = '1W' | '1M' | '3M' | '6M' | '1Y';

const RANGES: Range[] = ['1W', '1M', '3M', '6M', '1Y'];

const chartTheme = {
  axis: 'rgb(var(--text-muted))',
  grid: 'rgb(var(--text-muted) / 0.15)',
};

export function Progress() {
  const profileId = useProfileStore((s) => s.profileId);
  const [range, setRange] = useState<Range>('1M');
  const [weight, setWeight] = useState<any[]>([]);
  const [calories, setCalories] = useState<any>({ target: 0, data: [] });
  const [macros, setMacros] = useState<any>(null);
  const [completion, setCompletion] = useState<any[]>([]);
  const [habits, setHabits] = useState<any>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    if (!profileId) return;
    Promise.all([
      progressApi.weight(profileId, range).catch(() => []),
      progressApi.calories(profileId, range).catch(() => ({ target: 0, data: [] })),
      progressApi.macros(profileId, range).catch(() => null),
      progressApi.completion(profileId, range).catch(() => []),
      progressApi.habits(profileId).catch(() => null),
      achievementsApi.getAll(profileId).catch(() => []),
    ]).then(([w, c, m, comp, h, a]) => {
      setWeight(Array.isArray(w) ? w : []);
      setCalories(c);
      setMacros(m);
      setCompletion(Array.isArray(comp) ? comp : (comp as any)?.data || []);
      setHabits(h);
      setAchievements(Array.isArray(a) ? a : []);
    });
  }, [profileId, range]);

  const macroPie = macros
    ? [
        { name: 'Protein', value: macros.protein || 0, color: '#8b5cf6' },
        { name: 'Carbs', value: macros.carbs || 0, color: '#3b82f6' },
        { name: 'Fats', value: macros.fats || 0, color: '#f59e0b' },
      ]
    : [];

  const weightChange = weight.length > 1 ? weight[weight.length - 1].weight - weight[0].weight : 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Progress</h2>
        <p className="text-text-muted mt-1">Your journey, in numbers.</p>
      </div>

      {/* Range selector */}
      <div className="flex gap-2 overflow-x-auto">
        {RANGES.map((r) => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              range === r ? 'bg-brand-primary text-white shadow-glow' : 'bg-bg-elevated text-text-secondary'
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      {/* Weight trend */}
      <Card>
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-sm uppercase tracking-wide text-text-muted">Weight Trend</h3>
          {weight.length > 1 && (
            <div className={`flex items-center gap-1 text-sm font-bold ${weightChange < 0 ? 'text-brand-accent' : weightChange > 0 ? 'text-brand-danger' : 'text-text-muted'}`}>
              {weightChange < 0 ? <TrendingDown size={16} /> : <TrendingUp size={16} />}
              {weightChange > 0 ? '+' : ''}{weightChange.toFixed(1)} kg
            </div>
          )}
        </div>
        {weight.length === 0 ? (
          <p className="text-text-muted text-sm">No weight logs yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={weight}>
              <XAxis dataKey="date" stroke={chartTheme.axis} fontSize={11} tickFormatter={(d) => d.slice(5)} />
              <YAxis stroke={chartTheme.axis} fontSize={11} domain={['auto', 'auto']} />
              <Tooltip contentStyle={{ background: 'rgb(var(--bg-card))', border: '1px solid rgb(var(--text-muted) / 0.2)', borderRadius: 12 }} />
              <Line type="monotone" dataKey="weight" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4, fill: '#8b5cf6' }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </Card>

      {/* Calorie trend */}
      <Card>
        <h3 className="text-sm uppercase tracking-wide text-text-muted mb-4">Calorie Intake</h3>
        {calories.data?.length === 0 ? (
          <p className="text-text-muted text-sm">No meals logged yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={calories.data}>
              <XAxis dataKey="date" stroke={chartTheme.axis} fontSize={11} tickFormatter={(d) => d.slice(5)} />
              <YAxis stroke={chartTheme.axis} fontSize={11} />
              <Tooltip contentStyle={{ background: 'rgb(var(--bg-card))', border: '1px solid rgb(var(--text-muted) / 0.2)', borderRadius: 12 }} />
              <ReferenceLine y={calories.target} stroke="#10b981" strokeDasharray="3 3" />
              <Bar dataKey="calories" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </Card>

      {/* Macro donut + Completion */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <h3 className="text-sm uppercase tracking-wide text-text-muted mb-4">Macro Avg</h3>
          {!macros || macros.days === 0 ? (
            <p className="text-text-muted text-sm">No data yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={macroPie} dataKey="value" innerRadius={50} outerRadius={80} paddingAngle={3}>
                  {macroPie.map((m) => <Cell key={m.name} fill={m.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: 'rgb(var(--bg-card))', border: '1px solid rgb(var(--text-muted) / 0.2)', borderRadius: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
          {macros && macros.days > 0 && (
            <div className="flex justify-around text-xs mt-2">
              <div><span className="inline-block w-2 h-2 rounded-full bg-brand-primary mr-1" />P {Math.round(macros.protein)}g</div>
              <div><span className="inline-block w-2 h-2 rounded-full bg-brand-secondary mr-1" />C {Math.round(macros.carbs)}g</div>
              <div><span className="inline-block w-2 h-2 rounded-full bg-brand-warning mr-1" />F {Math.round(macros.fats)}g</div>
            </div>
          )}
        </Card>

        <Card>
          <h3 className="text-sm uppercase tracking-wide text-text-muted mb-4">Daily Completion</h3>
          {completion.length === 0 ? (
            <p className="text-text-muted text-sm">No data yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={completion}>
                <XAxis dataKey="date" stroke={chartTheme.axis} fontSize={11} tickFormatter={(d) => d.slice(5)} />
                <YAxis stroke={chartTheme.axis} fontSize={11} domain={[0, 100]} />
                <Tooltip contentStyle={{ background: 'rgb(var(--bg-card))', border: '1px solid rgb(var(--text-muted) / 0.2)', borderRadius: 12 }} />
                <Bar dataKey="completion" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>
      </div>

      {/* Habits */}
      {habits && (habits.best || habits.worst) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {habits.best && (
            <Card>
              <h3 className="text-sm uppercase tracking-wide text-text-muted mb-2">Best Habit</h3>
              <div className="text-2xl font-bold text-brand-accent capitalize">{habits.best.name}</div>
              <div className="text-xs text-text-muted">{Math.round(habits.best.rate)}% completion</div>
            </Card>
          )}
          {habits.worst && (
            <Card>
              <h3 className="text-sm uppercase tracking-wide text-text-muted mb-2">Needs Work</h3>
              <div className="text-2xl font-bold text-brand-danger capitalize">{habits.worst.name}</div>
              <div className="text-xs text-text-muted">{Math.round(habits.worst.rate)}% completion</div>
            </Card>
          )}
        </div>
      )}

      {/* Achievements */}
      {achievements.length > 0 && (
        <Card>
          <h3 className="text-sm uppercase tracking-wide text-text-muted mb-4 flex items-center gap-2">
            <Trophy size={14} /> Achievements
          </h3>
          <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
            {achievements.map((a) => (
              <div
                key={a.id}
                className={`text-center p-3 rounded-xl transition-all ${
                  a.earned ? 'bg-brand-primary/15 shadow-glow' : 'bg-bg-elevated opacity-40'
                }`}
              >
                <div className="text-3xl mb-1">{a.icon || '🏆'}</div>
                <div className="text-xs font-bold">{a.name}</div>
                <div className="text-[10px] text-text-muted mt-1">{a.description}</div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
