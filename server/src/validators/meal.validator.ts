import { z } from 'zod';

export const createMealSchema = z.object({
  profileId: z.number().int().positive(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
  category: z.enum(['breakfast', 'lunch', 'dinner', 'snacks']),
  name: z.string().min(1, 'Food name is required'),
  calories: z.number().min(0),
  protein: z.number().min(0).default(0),
  carbs: z.number().min(0).default(0),
  fats: z.number().min(0).default(0),
  time: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  isFavorite: z.boolean().default(false),
});

export const updateMealSchema = createMealSchema.partial().omit({ profileId: true });
