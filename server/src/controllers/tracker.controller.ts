import { Request, Response, NextFunction } from 'express';
import * as trackerService from '../services/tracker.service';

// --- Water ---
export async function logWater(req: Request, res: Response, next: NextFunction) {
  try {
    const water = await trackerService.upsertWater(req.body);
    res.status(200).json(water);
  } catch (err) {
    next(err);
  }
}

export async function getWater(req: Request, res: Response, next: NextFunction) {
  try {
    const profileId = parseInt(req.query.profileId as string);
    const date = req.query.date as string;
    const water = await trackerService.getWater(profileId, date);
    res.json(water || { amount: 0, unit: 'glasses' });
  } catch (err) {
    next(err);
  }
}

// --- Sleep ---
export async function logSleep(req: Request, res: Response, next: NextFunction) {
  try {
    const sleep = await trackerService.upsertSleep(req.body);
    res.status(200).json(sleep);
  } catch (err) {
    next(err);
  }
}

export async function getSleep(req: Request, res: Response, next: NextFunction) {
  try {
    const profileId = parseInt(req.query.profileId as string);
    const date = req.query.date as string;
    const sleep = await trackerService.getSleep(profileId, date);
    res.json(sleep || { hours: 0 });
  } catch (err) {
    next(err);
  }
}

// --- Steps ---
export async function logSteps(req: Request, res: Response, next: NextFunction) {
  try {
    const steps = await trackerService.upsertSteps(req.body);
    res.status(200).json(steps);
  } catch (err) {
    next(err);
  }
}

export async function getSteps(req: Request, res: Response, next: NextFunction) {
  try {
    const profileId = parseInt(req.query.profileId as string);
    const date = req.query.date as string;
    const steps = await trackerService.getSteps(profileId, date);
    res.json(steps || { count: 0 });
  } catch (err) {
    next(err);
  }
}

// --- Weight ---
export async function logWeight(req: Request, res: Response, next: NextFunction) {
  try {
    const weight = await trackerService.upsertWeight(req.body);
    res.status(200).json(weight);
  } catch (err) {
    next(err);
  }
}

export async function getWeightHistory(req: Request, res: Response, next: NextFunction) {
  try {
    const profileId = parseInt(req.query.profileId as string);
    const range = (req.query.range as string) || '1M';
    const history = await trackerService.getWeightHistory(profileId, range);
    res.json(history);
  } catch (err) {
    next(err);
  }
}
