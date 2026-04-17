import { Request, Response, NextFunction } from 'express';
import * as cardioService from '../services/cardio.service';

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const cardio = await cardioService.createCardio(req.body);
    res.status(201).json(cardio);
  } catch (err) {
    next(err);
  }
}

export async function getByDate(req: Request, res: Response, next: NextFunction) {
  try {
    const profileId = parseInt(req.query.profileId as string);
    const date = req.query.date as string;
    if (!profileId || !date) {
      res.status(400).json({ error: 'profileId and date are required' });
      return;
    }
    const cardio = await cardioService.getCardioByDate(profileId, date);
    res.json(cardio);
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id as string);
    await cardioService.deleteCardio(id);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}
