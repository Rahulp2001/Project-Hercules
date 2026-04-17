import { z } from 'zod';

export const createTargetSchema = z.object({
  profileId: z.number().int().positive(),
  name: z.string().min(1, 'Target name is required'),
  isActive: z.boolean().default(true),
});

export const updateTargetSchema = z.object({
  name: z.string().min(1).optional(),
  isActive: z.boolean().optional(),
});

export const dailyTargetSchema = z.object({
  profileId: z.number().int().positive(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  completionPct: z.number().min(0).max(100),
  targetsMet: z.record(z.string(), z.boolean()).optional(),
  notes: z.string().optional(),
});
