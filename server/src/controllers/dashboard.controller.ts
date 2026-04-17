import { Request, Response, NextFunction } from 'express';
import * as dashboardService from '../services/dashboard.service';
import { checkAndAwardBadges } from '../services/achievement.service';

export async function getDashboard(req: Request, res: Response, next: NextFunction) {
  try {
    const profileId = parseInt(req.query.profileId as string);
    const date = (req.query.date as string) || new Date().toISOString().split('T')[0];

    if (!profileId) {
      res.status(400).json({ error: 'profileId is required' });
      return;
    }

    const data = await dashboardService.getDashboardData(profileId, date);
    if (!data) {
      res.status(404).json({ error: 'Profile not found' });
      return;
    }

    // Recalculate completion from actual data
    const totalCals = Object.values(data.meals as any).flat().reduce((s: number, m: any) => s + m.calories, 0);

    // Check if weight was logged today
    const { PrismaClient } = require('@prisma/client');
    const prisma2 = new PrismaClient();
    const weightToday = await prisma2.weightLog.findUnique({
      where: { profileId_date: { profileId, date } },
    });
    await prisma2.$disconnect();

    const checks = [
      totalCals >= (data.calories.target || 2000) * 0.5,
      data.water.amount >= data.water.goal,
      data.steps.count >= data.steps.goal,
      data.sleep.hours > 0,
      (data.workouts as any[]).length > 0 || (data.cardio as any[]).length > 0,
      !!weightToday,
    ];
    const met = checks.filter(Boolean).length;
    data.completion = Math.round((met / checks.length) * 100);

    // Check for new badges
    const newBadges = await checkAndAwardBadges(profileId);

    res.json({ ...data, newBadges });
  } catch (err) {
    next(err);
  }
}
