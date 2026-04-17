import { z } from 'zod';

export const createProfileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  age: z.number().int().min(13).max(120),
  gender: z.enum(['male', 'female', 'other']),
  weight: z.number().positive(),
  weightUnit: z.enum(['kg', 'lbs']).default('kg'),
  height: z.number().positive(),
  heightUnit: z.enum(['cm', 'ft']).default('cm'),
  activityLevel: z.enum(['sedentary', 'light', 'moderate', 'very', 'extreme']),
  goal: z.enum(['cut', 'bulk', 'maintain']),
  proteinPct: z.number().int().min(0).max(100).default(30),
  carbsPct: z.number().int().min(0).max(100).default(40),
  fatsPct: z.number().int().min(0).max(100).default(30),
});

export const updateProfileSchema = createProfileSchema.partial();
