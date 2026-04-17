import { Request, Response, NextFunction } from 'express';
import * as settingsService from '../services/settings.service';

export async function get(req: Request, res: Response, next: NextFunction) {
  try {
    const profileId = parseInt(req.query.profileId as string);
    const settings = await settingsService.getSettings(profileId);
    if (!settings) {
      res.status(404).json({ error: 'Settings not found' });
      return;
    }
    res.json(settings);
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const profileId = parseInt(req.query.profileId as string);
    const settings = await settingsService.updateSettings(profileId, req.body);
    res.json(settings);
  } catch (err) {
    next(err);
  }
}
