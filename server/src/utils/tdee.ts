/**
 * Calculate BMR using Mifflin-St Jeor equation
 */
export function calculateBMR(
  weight: number, // kg
  height: number, // cm
  age: number,
  gender: string
): number {
  if (gender === 'male') {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  }
  // female or other
  return 10 * weight + 6.25 * height - 5 * age - 161;
}

const ACTIVITY_MULTIPLIERS: Record<string, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  very: 1.725,
  extreme: 1.9,
};

/**
 * Calculate TDEE from BMR and activity level
 */
export function calculateTDEE(bmr: number, activityLevel: string): number {
  const multiplier = ACTIVITY_MULTIPLIERS[activityLevel] || 1.55;
  return Math.round(bmr * multiplier);
}

/**
 * Calculate calorie target based on goal
 */
export function calculateCalorieTarget(tdee: number, goal: string): number {
  switch (goal) {
    case 'cut':
      return Math.round(tdee * 0.8); // 20% deficit
    case 'bulk':
      return Math.round(tdee * 1.15); // 15% surplus
    case 'maintain':
    default:
      return tdee;
  }
}

/**
 * Calculate macro grams from calorie target and percentages
 */
export function calculateMacros(
  calorieTarget: number,
  proteinPct: number,
  carbsPct: number,
  fatsPct: number
) {
  return {
    proteinGrams: Math.round((calorieTarget * (proteinPct / 100)) / 4),
    carbsGrams: Math.round((calorieTarget * (carbsPct / 100)) / 4),
    fatsGrams: Math.round((calorieTarget * (fatsPct / 100)) / 9),
  };
}
