import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function createTarget(data: {
  profileId: number;
  name: string;
  isActive: boolean;
}) {
  return prisma.customTarget.create({ data });
}

export async function getTargets(profileId: number) {
  return prisma.customTarget.findMany({
    where: { profileId, isActive: true },
    orderBy: { createdAt: 'asc' },
  });
}

export async function updateTarget(id: number, data: { name?: string; isActive?: boolean }) {
  return prisma.customTarget.update({ where: { id }, data });
}

export async function deleteTarget(id: number) {
  return prisma.customTarget.delete({ where: { id } });
}

export async function upsertDailyLog(data: {
  profileId: number;
  date: string;
  completionPct: number;
  targetsMet?: Record<string, boolean>;
  notes?: string;
}) {
  const { targetsMet, ...rest } = data;
  return prisma.dailyLog.upsert({
    where: {
      profileId_date: { profileId: data.profileId, date: data.date },
    },
    update: {
      completionPct: data.completionPct,
      targetsMet: targetsMet ? JSON.stringify(targetsMet) : undefined,
      notes: data.notes,
    },
    create: {
      ...rest,
      targetsMet: targetsMet ? JSON.stringify(targetsMet) : undefined,
    },
  });
}
