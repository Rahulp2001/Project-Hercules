import { PrismaClient } from '@prisma/client';
import { calculateBMR, calculateTDEE, calculateCalorieTarget } from '../utils/tdee';

const prisma = new PrismaClient();

function toKg(weight: number, unit: string): number {
  return unit === 'lbs' ? weight * 0.453592 : weight;
}

function toCm(height: number, unit: string): number {
  return unit === 'ft' ? height * 30.48 : height;
}

export async function createProfile(data: {
  name: string;
  age: number;
  gender: string;
  weight: number;
  weightUnit: string;
  height: number;
  heightUnit: string;
  activityLevel: string;
  goal: string;
  proteinPct: number;
  carbsPct: number;
  fatsPct: number;
}) {
  const weightKg = toKg(data.weight, data.weightUnit);
  const heightCm = toCm(data.height, data.heightUnit);

  const bmr = calculateBMR(weightKg, heightCm, data.age, data.gender);
  const tdee = calculateTDEE(bmr, data.activityLevel);
  const calorieTarget = calculateCalorieTarget(tdee, data.goal);

  const profile = await prisma.profile.create({
    data: {
      ...data,
      bmr: Math.round(bmr),
      tdee,
      calorieTarget,
      settings: {
        create: {
          weightUnit: data.weightUnit,
          heightUnit: data.heightUnit,
        },
      },
    },
    include: { settings: true },
  });

  return profile;
}

export async function getProfile(id: number) {
  return prisma.profile.findUnique({
    where: { id },
    include: { settings: true },
  });
}

export async function updateProfile(
  id: number,
  data: Partial<{
    name: string;
    age: number;
    gender: string;
    weight: number;
    weightUnit: string;
    height: number;
    heightUnit: string;
    activityLevel: string;
    goal: string;
    proteinPct: number;
    carbsPct: number;
    fatsPct: number;
  }>
) {
  // Fetch current profile to merge with updates
  const current = await prisma.profile.findUnique({ where: { id } });
  if (!current) return null;

  const merged = { ...current, ...data };
  const weightKg = toKg(merged.weight, merged.weightUnit);
  const heightCm = toCm(merged.height, merged.heightUnit);

  const bmr = calculateBMR(weightKg, heightCm, merged.age, merged.gender);
  const tdee = calculateTDEE(bmr, merged.activityLevel);
  const calorieTarget = calculateCalorieTarget(tdee, merged.goal);

  return prisma.profile.update({
    where: { id },
    data: {
      ...data,
      bmr: Math.round(bmr),
      tdee,
      calorieTarget,
    },
    include: { settings: true },
  });
}
