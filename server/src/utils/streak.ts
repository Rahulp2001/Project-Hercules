interface DailyLogEntry {
  date: string;
  completionPct: number;
}

function toLocalDateString(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Calculate current streak and best streak from daily logs.
 * - currentStreak: consecutive days ending at today (or yesterday) that meet threshold
 * - bestStreak: longest consecutive streak ever
 */
export function calculateStreaks(
  logs: DailyLogEntry[],
  threshold: number = 80
) {
  if (logs.length === 0) {
    return { currentStreak: 0, bestStreak: 0 };
  }

  // Build a map of date → meetsThreshold
  const logMap = new Map<string, boolean>();
  for (const log of logs) {
    logMap.set(log.date, log.completionPct >= threshold);
  }

  // Get all dates that meet threshold, sorted ascending
  const qualifyingDates = Array.from(logMap.entries())
    .filter(([_, met]) => met)
    .map(([date]) => date)
    .sort();

  if (qualifyingDates.length === 0) {
    return { currentStreak: 0, bestStreak: 0 };
  }

  // Calculate best streak — find longest run of consecutive dates
  let bestStreak = 1;
  let tempStreak = 1;
  for (let i = 1; i < qualifyingDates.length; i++) {
    const prev = new Date(qualifyingDates[i - 1]);
    const curr = new Date(qualifyingDates[i]);
    const diffDays = Math.round((curr.getTime() - prev.getTime()) / 86400000);
    if (diffDays === 1) {
      tempStreak++;
      bestStreak = Math.max(bestStreak, tempStreak);
    } else {
      tempStreak = 1;
    }
  }

  // Calculate current streak — count back from today or yesterday
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = toLocalDateString(today);
  const yesterday = new Date(today.getTime() - 86400000);
  const yesterdayStr = toLocalDateString(yesterday);

  let currentStreak = 0;
  let cursor: Date;

  if (logMap.get(todayStr)) {
    cursor = new Date(today);
  } else if (logMap.get(yesterdayStr)) {
    cursor = new Date(yesterday);
  } else {
    return { currentStreak: 0, bestStreak };
  }

  while (true) {
    const cursorStr = toLocalDateString(cursor);
    if (logMap.get(cursorStr)) {
      currentStreak++;
      cursor = new Date(cursor.getTime() - 86400000);
    } else {
      break;
    }
  }

  return { currentStreak, bestStreak };
}
