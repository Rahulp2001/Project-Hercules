import { z } from 'zod';

export const updateSettingsSchema = z.object({
  theme: z.enum(['dark', 'light']).optional(),
  weightUnit: z.enum(['kg', 'lbs']).optional(),
  heightUnit: z.enum(['cm', 'ft']).optional(),
  distanceUnit: z.enum(['km', 'mi']).optional(),
  dateFormat: z.string().optional(),
  waterGoal: z.number().int().positive().optional(),
  waterUnit: z.enum(['glasses', 'ml', 'oz']).optional(),
  stepGoal: z.number().int().positive().optional(),
  sleepGoal: z.number().positive().max(24).optional(),
  streakThreshold: z.number().int().min(1).max(100).optional(),
  restTimerDefault: z.number().int().positive().optional(),
});
