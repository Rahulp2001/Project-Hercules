import { useState, useEffect } from 'react';
import { User, Scale, Ruler, Activity, Target } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { profileApi } from '../api';
import { useProfileStore } from '../stores/profileStore';

type Gender = 'male' | 'female' | 'other';
type Activity = 'sedentary' | 'light' | 'moderate' | 'very' | 'extreme';
type Goal = 'cut' | 'bulk' | 'maintain';

export function Profile() {
  const profileId = useProfileStore((s) => s.profileId);
  const setProfile = useProfileStore((s) => s.setProfile);
  const profile = useProfileStore((s) => s.profile);

  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<Gender>('male');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [activityLevel, setActivityLevel] = useState<Activity>('moderate');
  const [goal, setGoal] = useState<Goal>('maintain');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      setAge(String(profile.age || ''));
      setGender((profile.gender as Gender) || 'male');
      setWeight(String(profile.weight || ''));
      setHeight(String(profile.height || ''));
      setActivityLevel((profile.activityLevel as Activity) || 'moderate');
      setGoal((profile.goal as Goal) || 'maintain');
    }
  }, [profile]);

  const save = async () => {
    if (!profileId) return;
    setSaving(true);
    try {
      const updated = await profileApi.update(profileId, {
        name, age: Number(age), gender, weight: Number(weight),
        height: Number(height), activityLevel, goal,
      });
      setProfile(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  const bmi = profile?.weight && profile?.height
    ? profile.weight / Math.pow(profile.height / 100, 2)
    : null;
  const bmiLabel = bmi
    ? bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal' : bmi < 30 ? 'Overweight' : 'Obese'
    : null;

  const stats = [
    { icon: Scale, label: 'Weight', value: profile?.weight ? `${profile.weight} kg` : '—' },
    { icon: Ruler, label: 'Height', value: profile?.height ? `${profile.height} cm` : '—' },
    { icon: Activity, label: 'TDEE', value: profile?.tdee ? `${Math.round(profile.tdee)} kcal` : '—' },
    { icon: Target, label: 'Target', value: profile?.calorieTarget ? `${Math.round(profile.calorieTarget)} kcal` : '—' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Profile</h2>
        <p className="text-text-muted mt-1">Your stats and goals.</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map(({ icon: Icon, label, value }) => (
          <Card key={label} className="text-center">
            <Icon size={20} className="text-brand-primary mx-auto mb-2" />
            <div className="text-lg font-bold">{value}</div>
            <div className="text-xs text-text-muted">{label}</div>
          </Card>
        ))}
      </div>

      {/* BMI card */}
      {bmi && (
        <Card>
          <h3 className="text-sm uppercase tracking-wide text-text-muted mb-3">BMI</h3>
          <div className="flex items-end gap-4">
            <div className="text-5xl font-bold">{bmi.toFixed(1)}</div>
            <span className={`text-sm font-semibold mb-1 ${
              bmiLabel === 'Normal' ? 'text-green-400' :
              bmiLabel === 'Overweight' ? 'text-yellow-400' :
              bmiLabel === 'Obese' ? 'text-red-400' : 'text-blue-400'
            }`}>{bmiLabel}</span>
          </div>
          <div className="relative mt-4 h-3 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
            <div className="absolute inset-0 flex">
              <div className="h-full bg-blue-400" style={{ width: '18.5%' }} />
              <div className="h-full bg-green-400" style={{ width: '16.5%' }} />
              <div className="h-full bg-yellow-400" style={{ width: '10%' }} />
              <div className="h-full bg-red-400" style={{ flex: 1 }} />
            </div>
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow border-2 border-bg-card"
              style={{ left: `${Math.min(95, Math.max(2, ((bmi - 10) / 30) * 100))}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-text-muted mt-1">
            <span>10</span><span>18.5</span><span>25</span><span>30</span><span>40+</span>
          </div>
        </Card>
      )}

      {/* Edit form */}
      <Card>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-brand-primary/15 rounded-full shadow-glow">
            <User size={22} className="text-brand-primary" />
          </div>
          <h3 className="text-lg font-bold">Edit Profile</h3>
        </div>
        <div className="space-y-4">
          <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Age" type="number" value={age} onChange={(e) => setAge(e.target.value)} />
            <div>
              <label className="block text-sm text-text-secondary mb-2">Gender</label>
              <div className="flex gap-2">
                {(['male', 'female', 'other'] as Gender[]).map((g) => (
                  <button
                    key={g}
                    onClick={() => setGender(g)}
                    className={`flex-1 py-2 rounded-lg text-xs capitalize transition-all ${
                      gender === g ? 'bg-brand-primary text-white shadow-glow' : 'bg-bg-elevated text-text-secondary'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Weight (kg)" type="number" value={weight} onChange={(e) => setWeight(e.target.value)} />
            <Input label="Height (cm)" type="number" value={height} onChange={(e) => setHeight(e.target.value)} />
          </div>

          <div>
            <label className="block text-sm text-text-secondary mb-2">Activity Level</label>
            <div className="space-y-2">
              {[
                { v: 'sedentary', l: 'Sedentary', d: 'Little to no exercise' },
                { v: 'light', l: 'Light', d: '1-3 days/week' },
                { v: 'moderate', l: 'Moderate', d: '3-5 days/week' },
                { v: 'very', l: 'Very Active', d: '6-7 days/week' },
                { v: 'extreme', l: 'Extreme', d: 'Athlete / physical job' },
              ].map((opt) => (
                <button
                  key={opt.v}
                  onClick={() => setActivityLevel(opt.v as Activity)}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all ${
                    activityLevel === opt.v ? 'bg-brand-primary/20 text-brand-primary shadow-glow' : 'bg-bg-elevated text-text-secondary'
                  }`}
                >
                  <div className="text-sm font-medium">{opt.l}</div>
                  <div className="text-xs text-text-muted">{opt.d}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm text-text-secondary mb-2">Goal</label>
            <div className="grid grid-cols-3 gap-2">
              {([
                { v: 'cut', l: 'Cut' },
                { v: 'maintain', l: 'Maintain' },
                { v: 'bulk', l: 'Bulk' },
              ] as { v: Goal; l: string }[]).map((opt) => (
                <button
                  key={opt.v}
                  onClick={() => setGoal(opt.v)}
                  className={`py-3 rounded-xl text-sm font-medium transition-all ${
                    goal === opt.v ? 'bg-brand-primary text-white shadow-glow' : 'bg-bg-elevated text-text-secondary'
                  }`}
                >
                  {opt.l}
                </button>
              ))}
            </div>
          </div>

          <Button onClick={save} disabled={saving} className="w-full">
            {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
          </Button>
        </div>
      </Card>
    </div>
  );
}
