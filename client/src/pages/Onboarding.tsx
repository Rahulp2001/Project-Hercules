import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Dumbbell } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { profileApi } from '../api';
import { useProfileStore } from '../stores/profileStore';

type Gender = 'male' | 'female' | 'other';
type Activity = 'sedentary' | 'light' | 'moderate' | 'very' | 'extreme';
type Goal = 'cut' | 'bulk' | 'maintain';

interface FormData {
  name: string;
  dob: string; // YYYY-MM-DD
  gender: Gender;
  weight: string;
  weightUnit: 'kg' | 'lbs';
  height: string; // for cm: just cm value; for ft: feet value
  heightInches: string; // only used when unit is ft
  heightUnit: 'cm' | 'ft';
  activityLevel: Activity;
  goal: Goal;
}

function calcAge(dob: string): number {
  if (!dob) return 0;
  const birth = new Date(dob);
  if (isNaN(birth.getTime())) return 0;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

function toKg(weight: number, unit: 'kg' | 'lbs') {
  return unit === 'kg' ? weight : weight * 0.453592;
}
function toCm(feet: number, inches: number, unit: 'cm' | 'ft', cmValue: number) {
  if (unit === 'cm') return cmValue;
  return feet * 30.48 + inches * 2.54;
}

const TOTAL_STEPS = 6; // welcome + 5 question steps + results = handled below

export function Onboarding() {
  const navigate = useNavigate();
  const setProfile = useProfileStore((s) => s.setProfile);
  const [step, setStep] = useState(0); // 0=welcome, 1-5=questions, 6=results
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [data, setData] = useState<FormData>({
    name: '',
    dob: '',
    gender: 'male',
    weight: '',
    weightUnit: 'kg',
    height: '',
    heightInches: '',
    heightUnit: 'cm',
    activityLevel: 'moderate',
    goal: 'maintain',
  });

  const age = calcAge(data.dob);

  const update = <K extends keyof FormData>(k: K, v: FormData[K]) => setData((d) => ({ ...d, [k]: v }));

  const canNext = (): boolean => {
    if (step === 1) return data.name.trim().length > 0;
    if (step === 2) return age > 0 && age < 120;
    if (step === 3) {
      const wOk = Number(data.weight) > 0;
      const hOk = data.heightUnit === 'cm'
        ? Number(data.height) > 0
        : Number(data.height) > 0; // feet required, inches optional
      return wOk && hOk;
    }
    return true;
  };

  const submit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const weightKg = toKg(Number(data.weight), data.weightUnit);
      const heightCm = toCm(
        Number(data.height),
        Number(data.heightInches || 0),
        data.heightUnit,
        Number(data.height)
      );
      const profile = await profileApi.create({
        name: data.name.trim(),
        age,
        gender: data.gender,
        weight: weightKg,
        weightUnit: 'kg',
        height: heightCm,
        heightUnit: 'cm',
        activityLevel: data.activityLevel,
        goal: data.goal,
      });
      setResult(profile);
      setProfile(profile);
      setStep(6);
    } catch (e: any) {
      setError(e?.response?.data?.error || 'Could not create profile');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Progress dots */}
        {step > 0 && step < 6 && (
          <div className="flex justify-center gap-2 mb-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === step ? 'w-8 bg-brand-primary' : i < step ? 'w-2 bg-brand-primary/50' : 'w-2 bg-text-muted/30'
                }`}
              />
            ))}
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card hover={false} className="p-8">
              {step === 0 && (
                <div className="text-center space-y-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.1 }}
                    className="inline-flex p-5 rounded-full bg-brand-primary/15 shadow-glow"
                  >
                    <Dumbbell size={48} className="text-brand-primary" />
                  </motion.div>
                  <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent">
                      HERCULES
                    </h1>
                    <p className="text-text-secondary mt-2">Forge your strength, one day at a time.</p>
                  </div>
                  <p className="text-text-muted text-sm">
                    Track meals, workouts, water, sleep, and steps. Build streaks. Hit your goals.
                  </p>
                  <Button onClick={() => setStep(1)} className="w-full">
                    Get Started <ArrowRight size={18} className="inline ml-2" />
                  </Button>
                </div>
              )}

              {step === 1 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold">What's your name?</h2>
                    <p className="text-text-muted mt-1">We'll use it to personalize your experience.</p>
                  </div>
                  <Input
                    placeholder="Your name"
                    value={data.name}
                    onChange={(e) => update('name', e.target.value)}
                    autoFocus
                  />
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold">Tell us about yourself</h2>
                    <p className="text-text-muted mt-1">Used to calculate your daily energy needs.</p>
                  </div>
                  <div>
                    <label className="block text-sm text-text-secondary mb-2">Date of Birth</label>
                    <input
                      type="date"
                      className="input"
                      max={new Date().toISOString().split('T')[0]}
                      value={data.dob}
                      onChange={(e) => update('dob', e.target.value)}
                    />
                    {age > 0 && (
                      <p className="text-xs text-brand-primary mt-2">You are {age} years old</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm text-text-secondary mb-2">Gender</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['male', 'female', 'other'] as Gender[]).map((g) => (
                        <button
                          key={g}
                          onClick={() => update('gender', g)}
                          className={`px-4 py-3 rounded-xl capitalize transition-all duration-300 ${
                            data.gender === g
                              ? 'bg-brand-primary/20 text-brand-primary shadow-glow'
                              : 'bg-bg-elevated text-text-secondary hover:text-brand-primary'
                          }`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold">Body stats</h2>
                    <p className="text-text-muted mt-1">Tap the unit to switch.</p>
                  </div>

                  {/* Weight */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm text-text-secondary">Weight</label>
                      <div className="flex bg-bg-elevated rounded-lg p-1 gap-1">
                        {(['kg', 'lbs'] as const).map((u) => (
                          <button
                            key={u}
                            onClick={() => update('weightUnit', u)}
                            className={`px-3 py-1 text-xs rounded-md transition-all ${
                              data.weightUnit === u ? 'bg-brand-primary text-white' : 'text-text-secondary'
                            }`}
                          >
                            {u}
                          </button>
                        ))}
                      </div>
                    </div>
                    <Input
                      type="number"
                      placeholder={data.weightUnit === 'kg' ? '70' : '155'}
                      value={data.weight}
                      onChange={(e) => update('weight', e.target.value)}
                    />
                  </div>

                  {/* Height */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm text-text-secondary">Height</label>
                      <div className="flex bg-bg-elevated rounded-lg p-1 gap-1">
                        {(['cm', 'ft'] as const).map((u) => (
                          <button
                            key={u}
                            onClick={() => update('heightUnit', u)}
                            className={`px-3 py-1 text-xs rounded-md transition-all ${
                              data.heightUnit === u ? 'bg-brand-primary text-white' : 'text-text-secondary'
                            }`}
                          >
                            {u === 'cm' ? 'cm' : 'ft/in'}
                          </button>
                        ))}
                      </div>
                    </div>
                    {data.heightUnit === 'cm' ? (
                      <Input
                        type="number"
                        placeholder="175"
                        value={data.height}
                        onChange={(e) => update('height', e.target.value)}
                      />
                    ) : (
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          type="number"
                          placeholder="ft"
                          value={data.height}
                          onChange={(e) => update('height', e.target.value)}
                        />
                        <Input
                          type="number"
                          placeholder="in"
                          value={data.heightInches}
                          onChange={(e) => update('heightInches', e.target.value)}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold">How active are you?</h2>
                    <p className="text-text-muted mt-1">Be honest — this affects your calorie target.</p>
                  </div>
                  <div className="space-y-2">
                    {[
                      { v: 'sedentary', l: 'Sedentary', d: 'Little to no exercise' },
                      { v: 'light', l: 'Light', d: '1-3 days a week' },
                      { v: 'moderate', l: 'Moderate', d: '3-5 days a week' },
                      { v: 'very', l: 'Very Active', d: '6-7 days a week' },
                      { v: 'extreme', l: 'Extreme', d: 'Athlete / physical job' },
                    ].map((opt) => (
                      <button
                        key={opt.v}
                        onClick={() => update('activityLevel', opt.v as Activity)}
                        className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 ${
                          data.activityLevel === opt.v
                            ? 'bg-brand-primary/20 text-brand-primary shadow-glow'
                            : 'bg-bg-elevated text-text-secondary hover:text-brand-primary'
                        }`}
                      >
                        <div className="font-medium">{opt.l}</div>
                        <div className="text-xs text-text-muted">{opt.d}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 5 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold">What's your goal?</h2>
                    <p className="text-text-muted mt-1">You can change this later.</p>
                  </div>
                  <div className="space-y-2">
                    {[
                      { v: 'cut', l: 'Cut', d: 'Lose fat (-20% calories)' },
                      { v: 'maintain', l: 'Maintain', d: 'Stay at current weight' },
                      { v: 'bulk', l: 'Bulk', d: 'Gain muscle (+15% calories)' },
                    ].map((opt) => (
                      <button
                        key={opt.v}
                        onClick={() => update('goal', opt.v as Goal)}
                        className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 ${
                          data.goal === opt.v
                            ? 'bg-brand-primary/20 text-brand-primary shadow-glow'
                            : 'bg-bg-elevated text-text-secondary hover:text-brand-primary'
                        }`}
                      >
                        <div className="font-medium">{opt.l}</div>
                        <div className="text-xs text-text-muted">{opt.d}</div>
                      </button>
                    ))}
                  </div>
                  {error && <p className="text-brand-danger text-sm">{error}</p>}
                </div>
              )}

              {step === 6 && result && (
                <div className="space-y-6 text-center">
                  <div>
                    <h2 className="text-2xl font-bold">You're all set, {result.name}!</h2>
                    <p className="text-text-muted mt-1">Here's your daily plan.</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-left">
                    <div className="bg-bg-elevated rounded-xl p-4">
                      <div className="text-xs text-text-muted">BMR</div>
                      <div className="text-xl font-bold">{Math.round(result.bmr)} kcal</div>
                    </div>
                    <div className="bg-bg-elevated rounded-xl p-4">
                      <div className="text-xs text-text-muted">TDEE</div>
                      <div className="text-xl font-bold">{Math.round(result.tdee)} kcal</div>
                    </div>
                    <div className="col-span-2 bg-brand-primary/15 rounded-xl p-4 shadow-glow">
                      <div className="text-xs text-brand-primary">Daily Calorie Target</div>
                      <div className="text-3xl font-bold text-brand-primary">{Math.round(result.calorieTarget)} kcal</div>
                    </div>
                    {result.macros && (
                      <>
                        <div className="bg-bg-elevated rounded-xl p-4">
                          <div className="text-xs text-text-muted">Protein</div>
                          <div className="text-lg font-bold">{Math.round(result.macros.proteinGrams)}g</div>
                        </div>
                        <div className="bg-bg-elevated rounded-xl p-4">
                          <div className="text-xs text-text-muted">Carbs</div>
                          <div className="text-lg font-bold">{Math.round(result.macros.carbsGrams)}g</div>
                        </div>
                        <div className="col-span-2 bg-bg-elevated rounded-xl p-4">
                          <div className="text-xs text-text-muted">Fats</div>
                          <div className="text-lg font-bold">{Math.round(result.macros.fatsGrams)}g</div>
                        </div>
                      </>
                    )}
                  </div>
                  <Button onClick={() => navigate('/')} className="w-full">
                    Start Tracking <ArrowRight size={18} className="inline ml-2" />
                  </Button>
                </div>
              )}

              {/* Navigation */}
              {step > 0 && step < 6 && (
                <div className="flex gap-3 mt-8">
                  {step > 1 && (
                    <Button variant="secondary" onClick={() => setStep(step - 1)}>
                      <ArrowLeft size={18} />
                    </Button>
                  )}
                  {step < 5 ? (
                    <Button onClick={() => setStep(step + 1)} disabled={!canNext()} className="flex-1">
                      Next <ArrowRight size={18} className="inline ml-2" />
                    </Button>
                  ) : (
                    <Button onClick={submit} disabled={submitting} className="flex-1">
                      {submitting ? 'Calculating...' : 'Calculate'} <ArrowRight size={18} className="inline ml-2" />
                    </Button>
                  )}
                </div>
              )}
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
