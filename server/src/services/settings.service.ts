import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getSettings(profileId: number) {
  return prisma.settings.findUnique({ where: { profileId } });
}

export async function updateSettings(profileId: number, data: Record<string, any>) {
  return prisma.settings.update({
    where: { profileId },
    data,
  });
}
