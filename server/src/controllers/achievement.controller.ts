import { Request, Response, NextFunction } from 'express';
import * as achievementService from '../services/achievement.service';

export async function getStreaks(req: Request, res: Response, next: NextFunction) {
  try {
    const profileId = parseInt(req.query.profileId as string);
    const streaks = await achievementService.getStreaks(profileId);
    res.json(streaks);
  } catch (err) {
    next(err);
  }
}

export async function getAchievements(req: Request, res: Response, next: NextFunction) {
  try {
    const profileId = parseInt(req.query.profileId as string);
    const achievements = await achievementService.getAchievements(profileId);
    res.json(achievements);
  } catch (err) {
    next(err);
  }
}
