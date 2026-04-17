import { Request, Response, NextFunction } from 'express';
import * as workoutService from '../services/workout.service';

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const workout = await workoutService.createWorkout(req.body);
    res.status(201).json(workout);
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
    const workouts = await workoutService.getWorkoutsByDate(profileId, date);
    res.json(workouts);
  } catch (err) {
    next(err);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id as string);
    const workout = await workoutService.getWorkoutById(id);
    if (!workout) {
      res.status(404).json({ error: 'Workout not found' });
      return;
    }
    res.json(workout);
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id as string);
    await workoutService.deleteWorkout(id);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

export async function getTemplates(req: Request, res: Response, next: NextFunction) {
  try {
    const profileId = parseInt(req.query.profileId as string);
    const templates = await workoutService.getTemplates(profileId);
    res.json(templates);
  } catch (err) {
    next(err);
  }
}

export async function getRecords(req: Request, res: Response, next: NextFunction) {
  try {
    const profileId = parseInt(req.query.profileId as string);
    const records = await workoutService.getPersonalRecords(profileId);
    res.json(records);
  } catch (err) {
    next(err);
  }
}
