import { describe, it, expect } from 'vitest';
import { calculateStreaks } from '../../src/utils/streak';

function makeLog(daysAgo: number, pct: number) {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - daysAgo);
  // Format as YYYY-MM-DD in local time (avoid UTC shift)
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return { date: `${year}-${month}-${day}`, completionPct: pct };
}

describe('Streak Calculations', () => {
  it('returns 0 for empty logs', () => {
    const result = calculateStreaks([]);
    expect(result.currentStreak).toBe(0);
    expect(result.bestStreak).toBe(0);
  });

  it('counts a single day streak (today)', () => {
    const logs = [makeLog(0, 90)];
    const result = calculateStreaks(logs, 80);
    expect(result.currentStreak).toBe(1);
    expect(result.bestStreak).toBe(1);
  });

  it('counts consecutive days', () => {
    const logs = [makeLog(0, 85), makeLog(1, 90), makeLog(2, 80)];
    const result = calculateStreaks(logs, 80);
    expect(result.currentStreak).toBe(3);
    expect(result.bestStreak).toBe(3);
  });

  it('breaks streak when below threshold', () => {
    const logs = [makeLog(0, 90), makeLog(1, 50), makeLog(2, 95)];
    const result = calculateStreaks(logs, 80);
    expect(result.currentStreak).toBe(1);
  });

  it('breaks streak with gap in dates', () => {
    const logs = [makeLog(0, 90), makeLog(2, 85)]; // skip day 1
    const result = calculateStreaks(logs, 80);
    expect(result.currentStreak).toBe(1);
  });

  it('tracks best streak separately from current', () => {
    // Current: 1 day, but had a 3-day streak before
    const logs = [
      makeLog(0, 90),
      makeLog(1, 50), // break
      makeLog(2, 85),
      makeLog(3, 90),
      makeLog(4, 80),
    ];
    const result = calculateStreaks(logs, 80);
    expect(result.currentStreak).toBe(1);
    expect(result.bestStreak).toBe(3);
  });
});
