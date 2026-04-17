import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface SetInput {
  reps: number;
  weight: number;
  type: string;
  sortOrder: number;
}

interface ExerciseInput {
  name: string;
  category: string;
  notes?: string;
  sortOrder: number;
  sets: SetInput[];
}

export async function createWorkout(data: {
  profileId: number;
  date: string;
  name: string;
  duration?: number;
  notes?: string;
  isTemplate: boolean;
  exercises: ExerciseInput[];
}) {
  const { exercises, ...workoutData } = data;

  return prisma.workout.create({
    data: {
      ...workoutData,
      exercises: {
        create: exercises.map((ex) => ({
          name: ex.name,
          category: ex.category,
          notes: ex.notes,
          sortOrder: ex.sortOrder,
          sets: {
            create: ex.sets.map((set) => ({
              reps: set.reps,
              weight: set.weight,
              type: set.type,
              sortOrder: set.sortOrder,
            })),
          },
        })),
      },
    },
    include: {
      exercises: {
        include: { sets: true },
        orderBy: { sortOrder: 'asc' },
      },
    },
  });
}

export async function getWorkoutsByDate(profileId: number, date: string) {
  return prisma.workout.findMany({
    where: { profileId, date, isTemplate: false },
    include: {
      exercises: {
        include: { sets: { orderBy: { sortOrder: 'asc' } } },
        orderBy: { sortOrder: 'asc' },
      },
    },
    orderBy: { createdAt: 'asc' },
  });
}

export async function getWorkoutById(id: number) {
  return prisma.workout.findUnique({
    where: { id },
    include: {
      exercises: {
        include: { sets: { orderBy: { sortOrder: 'asc' } } },
        orderBy: { sortOrder: 'asc' },
      },
    },
  });
}

export async function deleteWorkout(id: number) {
  return prisma.workout.delete({ where: { id } });
}

export async function getTemplates(profileId: number) {
  return prisma.workout.findMany({
    where: { profileId, isTemplate: true },
    include: {
      exercises: {
        include: { sets: { orderBy: { sortOrder: 'asc' } } },
        orderBy: { sortOrder: 'asc' },
      },
    },
  });
}

export async function getPersonalRecords(profileId: number) {
  // Get all exercises with sets for this profile
  const workouts = await prisma.workout.findMany({
    where: { profileId, isTemplate: false },
    include: {
      exercises: {
        include: { sets: true },
      },
    },
  });

  const records: Record<string, { weight: number; reps: number; date: string }> = {};

  for (const workout of workouts) {
    for (const exercise of workout.exercises) {
      for (const set of exercise.sets) {
        const key = exercise.name.toLowerCase();
        if (!records[key] || set.weight > records[key].weight) {
          records[key] = {
            weight: set.weight,
            reps: set.reps,
            date: workout.date,
          };
        }
      }
    }
  }

  return Object.entries(records).map(([name, record]) => ({
    exercise: name,
    ...record,
  }));
}
