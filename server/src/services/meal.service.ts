import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function createMeal(data: {
  profileId: number;
  date: string;
  category: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  time?: string;
  isFavorite: boolean;
}) {
  return prisma.meal.create({ data });
}

export async function getMealsByDate(profileId: number, date: string) {
  return prisma.meal.findMany({
    where: { profileId, date },
    orderBy: { createdAt: 'asc' },
  });
}

export async function updateMeal(id: number, data: Partial<{
  category: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  time: string;
  isFavorite: boolean;
}>) {
  return prisma.meal.update({ where: { id }, data });
}

export async function deleteMeal(id: number) {
  return prisma.meal.delete({ where: { id } });
}

export async function getFavorites(profileId: number) {
  return prisma.meal.findMany({
    where: { profileId, isFavorite: true },
    distinct: ['name'],
    orderBy: { createdAt: 'desc' },
  });
}

export async function getRecent(profileId: number, limit: number = 20) {
  return prisma.meal.findMany({
    where: { profileId },
    distinct: ['name'],
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
}
