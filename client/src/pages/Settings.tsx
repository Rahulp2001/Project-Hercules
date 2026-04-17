import { useState, useEffect } from 'react';
import { Bell, Droplet, Footprints, Moon, Target, Trash2 } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { settingsApi } from '../api';
import { useProfileStore } from '../stores/profileStore';
import { useThemeStore } from '../stores/themeStore';

export function Settings() {
  const profileId = useProfileStore((s) => s.profileId);
  const clearProfile = useProfileStore((s) => s.clearProfile);
  const theme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);

  const [waterGoal, setWaterGoal] = useState('8');
  const [stepGoal, setStepGoal] = useState('10000');
  const [sleepGoal, setSleepGoal] = useState('8');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!profileId) return;
    settingsApi.get(profileId).then((s: any) => {
      if (s?.dailyWaterGoal) setWaterGoal(String(s.dailyWaterGoal));
      if (s?.dailyStepGoal) setStepGoal(String(s.dailyStepGoal));
      if (s?.sleepGoalHours) setSleepGoal(String(s.sleepGoalHours));
    }).catch(() => {});
  }, [profileId]);

  const save = async () => {
    if (!profileId) return;
    setSaving(true);
    try {
      await settingsApi.update(profileId, {
        dailyWaterGoal: Number(waterGoal),
        dailyStepGoal: Number(stepGoal),
        sleepGoalHours: Number(sleepGoal),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Settings</h2>
        <p className="text-text-muted mt-1">Customize your experience.</p>
      </div>

      {/* Appearance */}
      <Card>
        <h3 className="text-sm uppercase tracking-wide text-text-muted mb-4">Appearance</h3>
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium">Theme</div>
            <div className="text-xs text-text-muted">Currently {theme} mode</div>
          </div>
          <button
            onClick={toggleTheme}
            className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors ${
              theme === 'dark' ? 'bg-brand-primary' : 'bg-bg-elevated'
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                theme === 'dark' ? 'translate-x-8' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </Card>

      {/* Daily goals */}
      <Card>
        <h3 className="text-sm uppercase tracking-wide text-text-muted mb-4">Daily Goals</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Droplet size={18} className="text-brand-secondary shrink-0" />
            <Input label="Water (glasses)" type="number" value={waterGoal} onChange={(e) => setWaterGoal(e.target.value)} />
          </div>
          <div className="flex items-center gap-3">
            <Footprints size={18} className="text-brand-accent shrink-0" />
            <Input label="Daily steps" type="number" value={stepGoal} onChange={(e) => setStepGoal(e.target.value)} />
          </div>
          <div className="flex items-center gap-3">
            <Moon size={18} className="text-brand-primary shrink-0" />
            <Input label="Sleep goal (hours)" type="number" value={sleepGoal} onChange={(e) => setSleepGoal(e.target.value)} />
          </div>
        </div>
        <Button onClick={save} disabled={saving} className="w-full mt-4">
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Goals'}
        </Button>
      </Card>

      {/* Danger zone */}
      <Card>
        <h3 className="text-sm uppercase tracking-wide text-brand-danger mb-4 flex items-center gap-2">
          <Trash2 size={14} /> Danger Zone
        </h3>
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium">Reset Profile</div>
            <div className="text-xs text-text-muted">Clear all data and start over</div>
          </div>
          <Button
            variant="secondary"
            className="text-brand-danger border border-brand-danger/30 hover:bg-brand-danger/10"
            onClick={() => {
              if (confirm('Are you sure? This will clear your local profile and take you back to onboarding.')) {
                clearProfile();
              }
            }}
          >
            Reset
          </Button>
        </div>
      </Card>
    </div>
  );
}
