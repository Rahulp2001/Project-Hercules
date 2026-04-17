import { PrismaClient } from '@prisma/client';
import { beforeAll, afterAll, beforeEach } from 'vitest';

export const prisma = new PrismaClient();

// Store the test profile ID so tests can reference it
export let testProfileId: number;

beforeAll(async () => {
  await prisma.$connect();
});

beforeEach(async () => {
  // Clean all tables before each test (order matters for foreign keys)
  await prisma.exerciseSet.deleteMany();
  await prisma.exercise.deleteMany();
  await prisma.workout.deleteMany();
  await prisma.meal.deleteMany();
  await prisma.cardio.deleteMany();
  await prisma.waterLog.deleteMany();
  await prisma.sleepLog.deleteMany();
  await prisma.stepLog.deleteMany();
  await prisma.weightLog.deleteMany();
  await prisma.customTarget.deleteMany();
  await prisma.dailyLog.deleteMany();
  await prisma.achievement.deleteMany();
  await prisma.settings.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.quote.deleteMany();

  // Seed a test profile (let DB assign the ID)
  const profile = await prisma.profile.create({
    data: {
      name: 'Test User',
      age: 25,
      gender: 'male',
      weight: 75,
      weightUnit: 'kg',
      height: 175,
      heightUnit: 'cm',
      activityLevel: 'moderate',
      goal: 'maintain',
      bmr: 1724,
      tdee: 2672,
      calorieTarget: 2672,
    },
  });

  testProfileId = profile.id;

  await prisma.settings.create({
    data: { profileId: profile.id },
  });

  // Seed a quote
  await prisma.quote.create({
    data: { text: 'Test quote', author: 'Tester' },
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});
