import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function getStartDate(range: string): string {
  const now = new Date();
  let start: Date;

  switch (range) {
    case '1W':
      start = new Date(now.getTime() - 7 * 86400000);
      break;
    case '2W':
      start = new Date(now.getTime() - 14 * 86400000);
      break;
    case '1M':
      start = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      break;
    case '3M':
      start = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
      break;
    case '6M':
      start = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
      break;
    case '1Y':
      start = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
      break;
    default:
      start = new Date(now.getTime() - 30 * 86400000);
  }

  return start.toISOString().split('T')[0];
}

export async function getWeightTrend(profileId: number, range: string) {
  const startDate = getStartDate(range);
  return prisma.weightLog.findMany({
    where: { profileId, date: { gte: startDate } },
    orderBy: { date: 'asc' },
  });
}

export async function getCalorieTrend(profileId: number, range: string) {
  const startDate = getStartDate(range);

  const meals = await prisma.meal.findMany({
    where: { profileId, date: { gte: startDate } },
  });

  const profile = await prisma.profile.findUnique({ where: { id: profileId } });

  // Group by date
  const byDate: Record<string, number> = {};
  for (const meal of meals) {
    byDate[meal.date] = (byDate[meal.date] || 0) + meal.calories;
  }

  return {
    target: profile?.calorieTarget || 0,
    data: Object.entries(byDate)
      .map(([date, calories]) => ({ date, calories: Math.round(calories) }))
      .sort((a, b) => a.date.localeCompare(b.date)),
  };
}

export async function getMacroAverages(profileId: number, range: string) {
  const startDate = getStartDate(range);

  const meals = await prisma.meal.findMany({
    where: { profileId, date: { gte: startDate } },
  });

  if (meals.length === 0) {
    return { protein: 0, carbs: 0, fats: 0, days: 0 };
  }

  // Get unique dates
  const dates = new Set(meals.map((m) => m.date));
  const days = dates.size;

  const totals = meals.reduce(
    (acc, m) => ({
      protein: acc.protein + m.protein,
      carbs: acc.carbs + m.carbs,
      fats: acc.fats + m.fats,
    }),
    { protein: 0, carbs: 0, fats: 0 }
  );

  return {
    protein: Math.round(totals.protein / days),
    carbs: Math.round(totals.carbs / days),
    fats: Math.round(totals.fats / days),
    days,
  };
}

export async function getCompletionData(profileId: number, range: string) {
  const startDate = getStartDate(range);

  const [settings, profile, meals, workouts, cardio, waterLogs, sleepLogs, stepLogs] = await Promise.all([
    prisma.settings.findUnique({ where: { profileId } }),
    prisma.profile.findUnique({ where: { id: profileId } }),
    prisma.meal.findMany({ where: { profileId, date: { gte: startDate } } }),
    prisma.workout.findMany({ where: { profileId, date: { gte: startDate }, isTemplate: false }, select: { date: true } }),
    prisma.cardio.findMany({ where: { profileId, date: { gte: startDate } }, select: { date: true } }),
    prisma.waterLog.findMany({ where: { profileId, date: { gte: startDate } } }),
    prisma.sleepLog.findMany({ where: { profileId, date: { gte: startDate } } }),
    prisma.stepLog.findMany({ where: { profileId, date: { gte: startDate } } }),
  ]);

  // Get all unique dates with any activity
  const allDates = new Set([
    ...meals.map((m) => m.date),
    ...workouts.map((w) => w.date),
    ...cardio.map((c) => c.date),
    ...waterLogs.map((w) => w.date),
    ...sleepLogs.map((s) => s.date),
    ...stepLogs.map((s) => s.date),
  ]);

  const waterGoal = settings?.waterGoal || 8;
  const stepGoal = settings?.stepGoal || 10000;
  const calorieTarget = profile?.calorieTarget || 2000;

  return Array.from(allDates).sort().map((date) => {
    const dayMeals = meals.filter((m) => m.date === date);
    const totalCals = dayMeals.reduce((s, m) => s + m.calories, 0);
    const water = waterLogs.find((w) => w.date === date);
    const sleep = sleepLogs.find((s) => s.date === date);
    const stepsLog = stepLogs.find((s) => s.date === date);
    const hasExercise = workouts.some((w) => w.date === date) || cardio.some((c) => c.date === date);

    const checks = [
      totalCals >= calorieTarget * 0.5,
      (water?.amount || 0) >= waterGoal,
      (stepsLog?.count || 0) >= stepGoal,
      !!sleep,
      hasExercise,
    ];
    const completion = Math.round((checks.filter(Boolean).length / checks.length) * 100);
    return { date, completion };
  });
}

export async function getHabitAnalysis(profileId: number) {
  // Look at last 30 days
  const startDate = getStartDate('1M');
  const settings = await prisma.settings.findUnique({ where: { profileId } });

  const [waterLogs, sleepLogs, stepLogs, mealDates, workoutDates] = await Promise.all([
    prisma.waterLog.findMany({ where: { profileId, date: { gte: startDate } } }),
    prisma.sleepLog.findMany({ where: { profileId, date: { gte: startDate } } }),
    prisma.stepLog.findMany({ where: { profileId, date: { gte: startDate } } }),
    prisma.meal.findMany({
      where: { profileId, date: { gte: startDate } },
      select: { date: true },
      distinct: ['date'],
    }),
    prisma.workout.findMany({
      where: { profileId, date: { gte: startDate }, isTemplate: false },
      select: { date: true },
      distinct: ['date'],
    }),
  ]);

  const waterGoal = settings?.waterGoal || 8;
  const sleepGoal = settings?.sleepGoal || 8;
  const stepGoal = settings?.stepGoal || 10000;

  const habits = [
    {
      name: 'Water',
      daysTracked: waterLogs.length,
      daysHitGoal: waterLogs.filter((w) => w.amount >= waterGoal).length,
      rate: waterLogs.length > 0
        ? Math.round((waterLogs.filter((w) => w.amount >= waterGoal).length / waterLogs.length) * 100)
        : 0,
    },
    {
      name: 'Sleep',
      daysTracked: sleepLogs.length,
      daysHitGoal: sleepLogs.filter((s) => s.hours >= sleepGoal).length,
      rate: sleepLogs.length > 0
        ? Math.round((sleepLogs.filter((s) => s.hours >= sleepGoal).length / sleepLogs.length) * 100)
        : 0,
    },
    {
      name: 'Steps',
      daysTracked: stepLogs.length,
      daysHitGoal: stepLogs.filter((s) => s.count >= stepGoal).length,
      rate: stepLogs.length > 0
        ? Math.round((stepLogs.filter((s) => s.count >= stepGoal).length / stepLogs.length) * 100)
        : 0,
    },
    {
      name: 'Meals',
      daysTracked: mealDates.length,
      daysHitGoal: mealDates.length, // tracked = goal met for meals
      rate: Math.round((mealDates.length / 30) * 100),
    },
    {
      name: 'Workouts',
      daysTracked: workoutDates.length,
      daysHitGoal: workoutDates.length,
      rate: Math.round((workoutDates.length / 30) * 100),
    },
  ];

  const sorted = [...habits].sort((a, b) => b.rate - a.rate);

  return {
    best: sorted[0] || null,
    worst: sorted[sorted.length - 1] || null,
    all: sorted,
  };
}

export async function getWeeklySummary(profileId: number) {
  // Last 7 days
  const startDate = getStartDate('1W');
  const settings = await prisma.settings.findUnique({ where: { profileId } });
  const profile = await prisma.profile.findUnique({ where: { id: profileId } });

  const [meals, workouts, cardio, waterLogs, sleepLogs, stepLogs, dailyLogs] =
    await Promise.all([
      prisma.meal.findMany({ where: { profileId, date: { gte: startDate } } }),
      prisma.workout.findMany({
        where: { profileId, date: { gte: startDate }, isTemplate: false },
      }),
      prisma.cardio.findMany({ where: { profileId, date: { gte: startDate } } }),
      prisma.waterLog.findMany({ where: { profileId, date: { gte: startDate } } }),
      prisma.sleepLog.findMany({ where: { profileId, date: { gte: startDate } } }),
      prisma.stepLog.findMany({ where: { profileId, date: { gte: startDate } } }),
      prisma.dailyLog.findMany({ where: { profileId, date: { gte: startDate } } }),
    ]);

  const totalCalories = meals.reduce((sum, m) => sum + m.calories, 0);
  const mealDays = new Set(meals.map((m) => m.date)).size;
  const avgCalories = mealDays > 0 ? Math.round(totalCalories / mealDays) : 0;

  const totalSleep = sleepLogs.reduce((sum, s) => sum + s.hours, 0);
  const avgSleep = sleepLogs.length > 0 ? +(totalSleep / sleepLogs.length).toFixed(1) : 0;

  const totalSteps = stepLogs.reduce((sum, s) => sum + s.count, 0);
  const avgSteps = stepLogs.length > 0 ? Math.round(totalSteps / stepLogs.length) : 0;

  const avgCompletion =
    dailyLogs.length > 0
      ? Math.round(
          dailyLogs.reduce((sum, d) => sum + d.completionPct, 0) / dailyLogs.length
        )
      : 0;

  return {
    period: { start: startDate, end: new Date().toISOString().split('T')[0] },
    calories: {
      average: avgCalories,
      target: profile?.calorieTarget || 0,
      total: Math.round(totalCalories),
    },
    workouts: {
      count: workouts.length,
      cardioSessions: cardio.length,
      caloriesBurned: Math.round(cardio.reduce((sum, c) => sum + (c.caloriesBurned || 0), 0)),
    },
    water: {
      avgGlasses: waterLogs.length > 0
        ? +(waterLogs.reduce((sum, w) => sum + w.amount, 0) / waterLogs.length).toFixed(1)
        : 0,
      goal: settings?.waterGoal || 8,
    },
    sleep: { average: avgSleep, goal: settings?.sleepGoal || 8 },
    steps: { average: avgSteps, goal: settings?.stepGoal || 10000 },
    completion: { average: avgCompletion, daysLogged: dailyLogs.length },
  };
}
