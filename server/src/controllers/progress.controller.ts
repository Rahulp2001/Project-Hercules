import { Request, Response, NextFunction } from 'express';
import * as progressService from '../services/progress.service';

export async function getWeightTrend(req: Request, res: Response, next: NextFunction) {
  try {
    const profileId = parseInt(req.query.profileId as string);
    const range = (req.query.range as string) || '1M';
    const data = await progressService.getWeightTrend(profileId, range);
    res.json(data);
  } catch (err) {
    next(err);
  }
}

export async function getCalorieTrend(req: Request, res: Response, next: NextFunction) {
  try {
    const profileId = parseInt(req.query.profileId as string);
    const range = (req.query.range as string) || '1W';
    const data = await progressService.getCalorieTrend(profileId, range);
    res.json(data);
  } catch (err) {
    next(err);
  }
}

export async function getMacroAverages(req: Request, res: Response, next: NextFunction) {
  try {
    const profileId = parseInt(req.query.profileId as string);
    const range = (req.query.range as string) || '1W';
    const data = await progressService.getMacroAverages(profileId, range);
    res.json(data);
  } catch (err) {
    next(err);
  }
}

export async function getCompletion(req: Request, res: Response, next: NextFunction) {
  try {
    const profileId = parseInt(req.query.profileId as string);
    const range = (req.query.range as string) || '1W';
    const data = await progressService.getCompletionData(profileId, range);
    res.json(data);
  } catch (err) {
    next(err);
  }
}

export async function getHabits(req: Request, res: Response, next: NextFunction) {
  try {
    const profileId = parseInt(req.query.profileId as string);
    const data = await progressService.getHabitAnalysis(profileId);
    res.json(data);
  } catch (err) {
    next(err);
  }
}

export async function getWeeklySummary(req: Request, res: Response, next: NextFunction) {
  try {
    const profileId = parseInt(req.query.profileId as string);
    const data = await progressService.getWeeklySummary(profileId);
    res.json(data);
  } catch (err) {
    next(err);
  }
}
