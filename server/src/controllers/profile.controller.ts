import { Request, Response, NextFunction } from 'express';
import * as profileService from '../services/profile.service';
import { calculateMacros } from '../utils/tdee';

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const profile = await profileService.createProfile(req.body);
    const macros = calculateMacros(
      profile.calorieTarget,
      profile.proteinPct,
      profile.carbsPct,
      profile.fatsPct
    );
    res.status(201).json({ ...profile, macros });
  } catch (err) {
    next(err);
  }
}

export async function get(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id);
    const profile = await profileService.getProfile(id);
    if (!profile) {
      res.status(404).json({ error: 'Profile not found' });
      return;
    }
    const macros = calculateMacros(
      profile.calorieTarget,
      profile.proteinPct,
      profile.carbsPct,
      profile.fatsPct
    );
    res.json({ ...profile, macros });
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id);
    const profile = await profileService.updateProfile(id, req.body);
    if (!profile) {
      res.status(404).json({ error: 'Profile not found' });
      return;
    }
    const macros = calculateMacros(
      profile.calorieTarget,
      profile.proteinPct,
      profile.carbsPct,
      profile.fatsPct
    );
    res.json({ ...profile, macros });
  } catch (err) {
    next(err);
  }
}
