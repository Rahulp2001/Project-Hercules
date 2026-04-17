import { z } from 'zod';

const exerciseSetSchema = z.object({
  reps: z.number().int().min(0),
  weight: z.number().min(0),
  type: z.enum(['normal', 'warmup', 'dropset', 'failure']).default('normal'),
  sortOrder: z.number().int().default(0),
});

const exerciseSchema = z.object({
  name: z.string().min(1, 'Exercise name is required'),
  category: z.enum([
    'Chest', 'Back', 'Shoulders', 'Arms', 'Legs', 'Core', 'Full Body', 'Other',
  ]),
  notes: z.string().optional(),
  sortOrder: z.number().int().default(0),
  sets: z.array(exerciseSetSchema).min(1, 'At least one set is required'),
});

export const createWorkoutSchema = z.object({
  profileId: z.number().int().positive(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  name: z.string().min(1, 'Workout name is required'),
  duration: z.number().int().positive().optional(),
  notes: z.string().optional(),
  isTemplate: z.boolean().default(false),
  exercises: z.array(exerciseSchema).min(1, 'At least one exercise is required'),
});
