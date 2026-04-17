import { z } from 'zod';

export const waterLogSchema = z.object({
  profileId: z.number().int().positive(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  amount: z.number().int().min(0),
  unit: z.enum(['glasses', 'ml', 'oz']).default('glasses'),
});

export const sleepLogSchema = z.object({
  profileId: z.number().int().positive(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  hours: z.number().min(0).max(24),
  quality: z.enum(['good', 'fair', 'poor']).optional(),
  bedtime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  wakeTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
});

export const stepLogSchema = z.object({
  profileId: z.number().int().positive(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  count: z.number().int().min(0),
});

export const weightLogSchema = z.object({
  profileId: z.number().int().positive(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  weight: z.number().positive(),
});
