import { PrismaClient } from '@prisma/client';
import { estimateCaloriesBurned } from '../utils/met';

const prisma = new PrismaClient();

export async function createCardio(data: {
  profileId: number;
  date: string;
  activityType: string;
  duration: number;
  distance?: number;
  caloriesBurned?: number;
}) {
  // If no calories provided, estimate using MET
  if (!data.caloriesBurned) {
    const profile = await prisma.profile.findUnique({
      where: { id: data.profileId },
    });
    if (profile) {
      data.caloriesBurned = estimateCaloriesBurned(
        data.activityType,
        data.duration,
        profile.weight
      );
    }
  }

  return prisma.cardio.create({ data });
}

export async function getCardioByDate(profileId: number, date: string) {
  return prisma.cardio.findMany({
    where: { profileId, date },
    orderBy: { createdAt: 'asc' },
  });
}

export async function deleteCardio(id: number) {
  return prisma.cardio.delete({ where: { id } });
}
