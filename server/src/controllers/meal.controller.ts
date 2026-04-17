import { Request, Response, NextFunction } from 'express';
import * as mealService from '../services/meal.service';

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const meal = await mealService.createMeal(req.body);
    res.status(201).json(meal);
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
    const meals = await mealService.getMealsByDate(profileId, date);
    res.json(meals);
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id);
    const meal = await mealService.updateMeal(id, req.body);
    res.json(meal);
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id);
    await mealService.deleteMeal(id);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

export async function getFavorites(req: Request, res: Response, next: NextFunction) {
  try {
    const profileId = parseInt(req.query.profileId as string);
    const favorites = await mealService.getFavorites(profileId);
    res.json(favorites);
  } catch (err) {
    next(err);
  }
}

export async function getRecent(req: Request, res: Response, next: NextFunction) {
  try {
    const profileId = parseInt(req.query.profileId as string);
    const recent = await mealService.getRecent(profileId);
    res.json(recent);
  } catch (err) {
    next(err);
  }
}
