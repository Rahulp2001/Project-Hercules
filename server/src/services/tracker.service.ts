import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// --- Water ---
export async function upsertWater(data: {
  profileId: number;
  date: string;
  amount: number;
  unit: string;
}) {
  return prisma.waterLog.upsert({
    where: {
      profileId_date: { profileId: data.profileId, date: data.date },
    },
    update: { amount: data.amount, unit: data.unit },
    create: data,
  });
}

export async function getWater(profileId: number, date: string) {
  return prisma.waterLog.findUnique({
    where: { profileId_date: { profileId, date } },
  });
}

// --- Sleep ---
export async function upsertSleep(data: {
  profileId: number;
  date: string;
  hours: number;
  quality?: string;
  bedtime?: string;
  wakeTime?: string;
}) {
  return prisma.sleepLog.upsert({
    where: {
      profileId_date: { profileId: data.profileId, date: data.date },
    },
    update: {
      hours: data.hours,
      quality: data.quality,
      bedtime: data.bedtime,
      wakeTime: data.wakeTime,
    },
    create: data,
  });
}

export async function getSleep(profileId: number, date: string) {
  return prisma.sleepLog.findUnique({
    where: { profileId_date: { profileId, date } },
  });
}

// --- Steps ---
export async function upsertSteps(data: {
  profileId: number;
  date: string;
  count: number;
}) {
  return prisma.stepLog.upsert({
    where: {
      profileId_date: { profileId: data.profileId, date: data.date },
    },
    update: { count: data.count },
    create: data,
  });
}

export async function getSteps(profileId: number, date: string) {
  return prisma.stepLog.findUnique({
    where: { profileId_date: { profileId, date } },
  });
}

// --- Weight ---
export async function upsertWeight(data: {
  profileId: number;
  date: string;
  weight: number;
}) {
  return prisma.weightLog.upsert({
    where: {
      profileId_date: { profileId: data.profileId, date: data.date },
    },
    update: { weight: data.weight },
    create: data,
  });
}

export async function getWeightHistory(profileId: number, range: string) {
  const now = new Date();
  let startDate: Date;

  switch (range) {
    case '1W':
      startDate = new Date(now.getTime() - 7 * 86400000);
      break;
    case '1M':
      startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      break;
    case '3M':
      startDate = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
      break;
    case '6M':
      startDate = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
      break;
    case '1Y':
      startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
      break;
    default:
      startDate = new Date(now.getTime() - 30 * 86400000);
  }

  const startStr = startDate.toISOString().split('T')[0];

  return prisma.weightLog.findMany({
    where: {
      profileId,
      date: { gte: startStr },
    },
    orderBy: { date: 'asc' },
  });
}
