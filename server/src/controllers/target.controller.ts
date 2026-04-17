import { Request, Response, NextFunction } from 'express';
import * as targetService from '../services/target.service';

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const target = await targetService.createTarget(req.body);
    res.status(201).json(target);
  } catch (err) {
    next(err);
  }
}

export async function getAll(req: Request, res: Response, next: NextFunction) {
  try {
    const profileId = parseInt(req.query.profileId as string);
    const targets = await targetService.getTargets(profileId);
    res.json(targets);
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id as string);
    const target = await targetService.updateTarget(id, req.body);
    res.json(target);
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id as string);
    await targetService.deleteTarget(id);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

export async function logDaily(req: Request, res: Response, next: NextFunction) {
  try {
    const log = await targetService.upsertDailyLog(req.body);
    res.json(log);
  } catch (err) {
    next(err);
  }
}
