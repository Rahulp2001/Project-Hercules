import { PrismaClient } from '@prisma/client';
import { BADGES } from '../utils/achievements';
import { calculateStreaks } from '../utils/streak';

const prisma = new PrismaClient();

export async function getStreaks(profileId: number) {
  // Gather all dates where ANY activity was logged
  const [meals, workouts, cardio, water, sleep, steps, weight] = await Promise.all([
    prisma.meal.findMany({ where: { profileId }, select: { date: true }, distinct: ['date'] }),
    prisma.workout.findMany({ where: { profileId, isTemplate: false }, select: { date: true }, distinct: ['date'] }),
    prisma.cardio.findMany({ where: { profileId }, select: { date: true }, distinct: ['date'] }),
    prisma.waterLog.findMany({ where: { profileId }, select: { date: true } }),
    prisma.sleepLog.findMany({ where: { profileId }, select: { date: true } }),
    prisma.stepLog.findMany({ where: { profileId }, select: { date: true } }),
    prisma.weightLog.findMany({ where: { profileId }, select: { date: true } }),
  ]);

  // Any activity on a date = that date counts for streak
  const activeDates = new Set([
    ...meals.map(r => r.date),
    ...workouts.map(r => r.date),
    ...cardio.map(r => r.date),
    ...water.map(r => r.date),
    ...sleep.map(r => r.date),
    ...steps.map(r => r.date),
    ...weight.map(r => r.date),
  ]);

  const logs = Array.from(activeDates).map(date => ({ date, completionPct: 100 }));
  return calculateStreaks(logs, 1); // threshold=1 so any activity counts
}

export async function getAchievements(profileId: number) {
  const earned = await prisma.achievement.findMany({
    where: { profileId },
  });

  const earnedIds = earned.map((a) => a.badge);

  return BADGES.map((badge) => {
    const achievement = earned.find((a) => a.badge === badge.id);
    return {
      ...badge,
      earned: !!achievement,
      earnedAt: achievement?.earnedAt || null,
    };
  });
}

export async function checkAndAwardBadges(profileId: number) {
  const earned = await prisma.achievement.findMany({ where: { profileId } });
  const earnedIds = earned.map((a) => a.badge);

  // Gather stats from real activity tables (not DailyLog which is never written)
  const [meals, workouts, cardio, water, sleep, steps, weight] = await Promise.all([
    prisma.meal.findMany({ where: { profileId }, select: { date: true }, distinct: ['date'] }),
    prisma.workout.findMany({ where: { profileId, isTemplate: false }, select: { date: true }, distinct: ['date'] }),
    prisma.cardio.findMany({ where: { profileId }, select: { date: true }, distinct: ['date'] }),
    prisma.waterLog.findMany({ where: { profileId }, select: { date: true } }),
    prisma.sleepLog.findMany({ where: { profileId }, select: { date: true } }),
    prisma.stepLog.findMany({ where: { profileId }, select: { date: true } }),
    prisma.weightLog.findMany({ where: { profileId }, select: { date: true } }),
  ]);

  const activeDates = new Set([
    ...meals.map(r => r.date),
    ...workouts.map(r => r.date),
    ...cardio.map(r => r.date),
    ...water.map(r => r.date),
    ...sleep.map(r => r.date),
    ...steps.map(r => r.date),
    ...weight.map(r => r.date),
  ]);

  const logs = Array.from(activeDates).map(date => ({ date, completionPct: 100 }));
  const streaks = calculateStreaks(logs, 1);

  const workoutCount = await prisma.workout.count({ where: { profileId, isTemplate: false } });
  const cardioCount = await prisma.cardio.count({ where: { profileId } });
  const weightLogCount = weight.length;

  const newBadgeIds: string[] = [];
  const check = (id: string, condition: boolean) => {
    if (condition && !earnedIds.includes(id)) newBadgeIds.push(id);
  };

  check('first_step', activeDates.size >= 1);
  check('week_warrior', streaks.bestStreak >= 7);
  check('two_week_titan', streaks.bestStreak >= 14);
  check('month_master', streaks.bestStreak >= 30);
  check('century_club', streaks.bestStreak >= 100);
  check('first_workout', workoutCount >= 1);
  check('fifty_workouts', workoutCount >= 50);
  check('first_cardio', cardioCount >= 1);
  check('weight_watcher', weightLogCount >= 30);

  // Award new badges
  for (const badge of newBadgeIds) {
    await prisma.achievement.create({ data: { profileId, badge } });
  }

  // Return full badge objects for the frontend popup
  return newBadgeIds.map(id => BADGES.find(b => b.id === id)).filter(Boolean);
}
