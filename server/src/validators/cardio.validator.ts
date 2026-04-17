import { z } from 'zod';

export const createCardioSchema = z.object({
  profileId: z.number().int().positive(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  activityType: z.enum([
    'running', 'cycling', 'swimming', 'walking', 'jumprope', 'elliptical', 'other',
  ]),
  duration: z.number().int().positive(),
  distance: z.number().positive().optional(),
  caloriesBurned: z.number().positive().optional(),
});
