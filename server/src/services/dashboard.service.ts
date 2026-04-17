import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function calcCompletion({ meals, workouts, cardio, water, sleep, steps, profile, settings }: any): number {
  const checks: boolean[] = [];

  // Calories: logged at least 50% of target
  const totalCals = meals.reduce((s: number, m: any) => s + m.calories, 0);
  checks.push(totalCals >= (profile.calorieTarget || 2000) * 0.5);

  // Water: hit goal
  const waterGoal = settings?.waterGoal || 8;
  checks.push((water?.amount || 0) >= waterGoal);

  // Steps: hit goal
  const stepGoal = settings?.stepGoal || 10000;
  checks.push((steps?.count || 0) >= stepGoal);

  // Sleep: logged
  checks.push(!!sleep);

  // Exercise: at least one workout or cardio
  checks.push(workouts.length > 0 || cardio.length > 0);

  const met = checks.filter(Boolean).length;
  console.log('[completion] checks:', checks, 'met:', met, 'total:', checks.length);
  return Math.round((met / checks.length) * 100);
}

export async function getDashboardData(profileId: number, date: string) {
  const [
    profile,
    meals,
    workouts,
    cardio,
    water,
    sleep,
    steps,
    dailyLog,
    targets,
    settings,
  ] = await Promise.all([
    prisma.profile.findUnique({ where: { id: profileId } }),
    prisma.meal.findMany({ where: { profileId, date }, orderBy: { createdAt: 'asc' } }),
    prisma.workout.findMany({
      where: { profileId, date, isTemplate: false },
      include: {
        exercises: {
          include: { sets: { orderBy: { sortOrder: 'asc' } } },
          orderBy: { sortOrder: 'asc' },
        },
      },
    }),
    prisma.cardio.findMany({ where: { profileId, date } }),
    prisma.waterLog.findUnique({
      where: { profileId_date: { profileId, date } },
    }),
    prisma.sleepLog.findUnique({
      where: { profileId_date: { profileId, date } },
    }),
    prisma.stepLog.findUnique({
      where: { profileId_date: { profileId, date } },
    }),
    prisma.dailyLog.findUnique({
      where: { profileId_date: { profileId, date } },
    }),
    prisma.customTarget.findMany({
      where: { profileId, isActive: true },
    }),
    prisma.settings.findUnique({ where: { profileId } }),
  ]);

  if (!profile) return null;

  // Calculate meal totals
  const mealTotals = meals.reduce(
    (acc, meal) => ({
      calories: acc.calories + meal.calories,
      protein: acc.protein + meal.protein,
      carbs: acc.carbs + meal.carbs,
      fats: acc.fats + meal.fats,
    }),
    { calories: 0, protein: 0, carbs: 0, fats: 0 }
  );

  // Group meals by category
  const mealsByCategory = {
    breakfast: meals.filter((m) => m.category === 'breakfast'),
    lunch: meals.filter((m) => m.category === 'lunch'),
    dinner: meals.filter((m) => m.category === 'dinner'),
    snacks: meals.filter((m) => m.category === 'snacks'),
  };

  // Cardio calorie total
  const cardioCalories = cardio.reduce(
    (sum, c) => sum + (c.caloriesBurned || 0),
    0
  );

  // Calculate macro targets in grams
  const macroTargets = {
    proteinGrams: Math.round((profile.calorieTarget * (profile.proteinPct / 100)) / 4),
    carbsGrams: Math.round((profile.calorieTarget * (profile.carbsPct / 100)) / 4),
    fatsGrams: Math.round((profile.calorieTarget * (profile.fatsPct / 100)) / 9),
  };

  return {
    date,
    profile: {
      id: profile.id,
      name: profile.name,
      calorieTarget: profile.calorieTarget,
      proteinPct: profile.proteinPct,
      carbsPct: profile.carbsPct,
      fatsPct: profile.fatsPct,
      goal: profile.goal,
    },
    calories: {
      consumed: Math.round(mealTotals.calories),
      burned: Math.round(cardioCalories),
      target: profile.calorieTarget,
      net: Math.round(mealTotals.calories - cardioCalories),
      remaining: Math.round(profile.calorieTarget - mealTotals.calories + cardioCalories),
    },
    macros: {
      protein: { consumed: Math.round(mealTotals.protein), target: macroTargets.proteinGrams },
      carbs: { consumed: Math.round(mealTotals.carbs), target: macroTargets.carbsGrams },
      fats: { consumed: Math.round(mealTotals.fats), target: macroTargets.fatsGrams },
    },
    meals: mealsByCategory,
    workouts,
    cardio,
    water: {
      amount: water?.amount || 0,
      unit: water?.unit || settings?.waterUnit || 'glasses',
      goal: settings?.waterGoal || 8,
    },
    sleep: {
      hours: sleep?.hours || 0,
      quality: sleep?.quality || null,
      bedtime: sleep?.bedtime || null,
      wakeTime: sleep?.wakeTime || null,
      goal: settings?.sleepGoal || 8,
    },
    steps: {
      count: steps?.count || 0,
      goal: settings?.stepGoal || 10000,
    },
    targets,
    completion: calcCompletion({ meals, workouts, cardio, water, sleep, steps, profile, settings }),
    targetsMet: dailyLog?.targetsMet ? JSON.parse(dailyLog.targetsMet) : {},
  };
}
