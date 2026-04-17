/**
 * MET (Metabolic Equivalent of Task) values for cardio activities
 * Used to estimate calories burned: calories = MET * weight(kg) * duration(hours)
 */
const MET_VALUES: Record<string, number> = {
  running: 9.8,
  cycling: 7.5,
  swimming: 8.0,
  walking: 3.8,
  jumprope: 12.3,
  elliptical: 5.0,
  other: 5.0,
};

/**
 * Estimate calories burned from cardio activity
 */
export function estimateCaloriesBurned(
  activityType: string,
  durationMinutes: number,
  weightKg: number
): number {
  const met = MET_VALUES[activityType] || MET_VALUES.other;
  const durationHours = durationMinutes / 60;
  return Math.round(met * weightKg * durationHours);
}
