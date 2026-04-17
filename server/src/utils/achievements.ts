/**
 * Badge definitions and detection logic
 */

export interface BadgeDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export const BADGES: BadgeDefinition[] = [
  { id: 'first_step', name: 'First Step', description: 'Complete your first day', icon: '👟' },
  { id: 'week_warrior', name: 'Week Warrior', description: '7-day streak', icon: '🔥' },
  { id: 'two_week_titan', name: 'Two Week Titan', description: '14-day streak', icon: '💪' },
  { id: 'month_master', name: 'Month Master', description: '30-day streak', icon: '🏆' },
  { id: 'century_club', name: 'Century Club', description: '100-day streak', icon: '💯' },
  { id: 'first_workout', name: 'Iron Starter', description: 'Log your first workout', icon: '🏋️' },
  { id: 'fifty_workouts', name: 'Gym Rat', description: 'Log 50 workouts', icon: '🐀' },
  { id: 'first_cardio', name: 'Heart Starter', description: 'Log your first cardio session', icon: '❤️' },
  { id: 'hydration_hero', name: 'Hydration Hero', description: 'Hit water goal 7 days in a row', icon: '💧' },
  { id: 'sleep_champion', name: 'Sleep Champion', description: 'Hit sleep goal 7 days in a row', icon: '😴' },
  { id: 'step_master', name: 'Step Master', description: 'Hit step goal 7 days in a row', icon: '🚶' },
  { id: 'macro_tracker', name: 'Macro Tracker', description: 'Log all meals for 7 days straight', icon: '🥗' },
  { id: 'weight_watcher', name: 'Weight Watcher', description: 'Log weight for 30 days', icon: '⚖️' },
  { id: 'personal_best', name: 'Personal Best', description: 'Set a new personal record', icon: '🥇' },
];

/**
 * Check which new badges should be awarded based on stats
 */
export function detectNewBadges(
  stats: {
    currentStreak: number;
    bestStreak: number;
    totalWorkouts: number;
    totalCardio: number;
    waterStreak: number;
    sleepStreak: number;
    stepStreak: number;
    mealLogStreak: number;
    weightLogCount: number;
    hasPersonalBest: boolean;
    daysCompleted: number;
  },
  earnedBadges: string[]
): string[] {
  const newBadges: string[] = [];

  const check = (id: string, condition: boolean) => {
    if (condition && !earnedBadges.includes(id)) {
      newBadges.push(id);
    }
  };

  check('first_step', stats.daysCompleted >= 1);
  check('week_warrior', stats.bestStreak >= 7);
  check('two_week_titan', stats.bestStreak >= 14);
  check('month_master', stats.bestStreak >= 30);
  check('century_club', stats.bestStreak >= 100);
  check('first_workout', stats.totalWorkouts >= 1);
  check('fifty_workouts', stats.totalWorkouts >= 50);
  check('first_cardio', stats.totalCardio >= 1);
  check('hydration_hero', stats.waterStreak >= 7);
  check('sleep_champion', stats.sleepStreak >= 7);
  check('step_master', stats.stepStreak >= 7);
  check('macro_tracker', stats.mealLogStreak >= 7);
  check('weight_watcher', stats.weightLogCount >= 30);
  check('personal_best', stats.hasPersonalBest);

  return newBadges;
}
