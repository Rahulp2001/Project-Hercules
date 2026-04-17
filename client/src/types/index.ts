export interface Profile {
  id: number;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  weight: number;
  weightUnit: string;
  height: number;
  heightUnit: string;
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'very' | 'extreme';
  goal: 'cut' | 'bulk' | 'maintain';
  bmr: number;
  tdee: number;
  calorieTarget: number;
  proteinPct: number;
  carbsPct: number;
  fatsPct: number;
  macros?: {
    proteinGrams: number;
    carbsGrams: number;
    fatsGrams: number;
  };
  settings?: Settings;
}

export interface Settings {
  id: number;
  profileId: number;
  theme: 'dark' | 'light';
  weightUnit: string;
  heightUnit: string;
  distanceUnit: string;
  dateFormat: string;
  waterGoal: number;
  waterUnit: string;
  stepGoal: number;
  sleepGoal: number;
  streakThreshold: number;
  restTimerDefault: number;
}

export interface Meal {
  id: number;
  profileId: number;
  date: string;
  category: 'breakfast' | 'lunch' | 'dinner' | 'snacks';
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  time?: string;
  isFavorite: boolean;
}

export interface ExerciseSet {
  id: number;
  reps: number;
  weight: number;
  type: 'normal' | 'warmup' | 'dropset' | 'failure';
  sortOrder: number;
}

export interface Exercise {
  id: number;
  name: string;
  category: string;
  notes?: string;
  sortOrder: number;
  sets: ExerciseSet[];
}

export interface Workout {
  id: number;
  profileId: number;
  date: string;
  name: string;
  duration?: number;
  notes?: string;
  isTemplate: boolean;
  exercises: Exercise[];
}

export interface Cardio {
  id: number;
  profileId: number;
  date: string;
  activityType: string;
  duration: number;
  distance?: number;
  caloriesBurned?: number;
}

export interface DashboardData {
  date: string;
  profile: {
    id: number;
    name: string;
    calorieTarget: number;
    proteinPct: number;
    carbsPct: number;
    fatsPct: number;
    goal: string;
  };
  calories: {
    consumed: number;
    burned: number;
    target: number;
    net: number;
    remaining: number;
  };
  macros: {
    protein: { consumed: number; target: number };
    carbs: { consumed: number; target: number };
    fats: { consumed: number; target: number };
  };
  meals: {
    breakfast: Meal[];
    lunch: Meal[];
    dinner: Meal[];
    snacks: Meal[];
  };
  workouts: Workout[];
  cardio: Cardio[];
  water: { amount: number; unit: string; goal: number };
  sleep: {
    hours: number;
    quality: string | null;
    bedtime: string | null;
    wakeTime: string | null;
    goal: number;
  };
  steps: { count: number; goal: number };
  targets: Array<{ id: number; name: string; isActive: boolean }>;
  completion: number;
  targetsMet: Record<string, boolean>;
  newBadges?: Array<{ id: string; name: string; description: string; icon: string }>;
}

export interface Quote {
  id: number;
  text: string;
  author: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedAt: string | null;
}

export interface Streaks {
  currentStreak: number;
  bestStreak: number;
}
