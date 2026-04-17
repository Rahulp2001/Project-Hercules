import { describe, it, expect } from 'vitest';
import { detectNewBadges, BADGES } from '../../src/utils/achievements';

const defaultStats = {
  currentStreak: 0,
  bestStreak: 0,
  totalWorkouts: 0,
  totalCardio: 0,
  waterStreak: 0,
  sleepStreak: 0,
  stepStreak: 0,
  mealLogStreak: 0,
  weightLogCount: 0,
  hasPersonalBest: false,
  daysCompleted: 0,
};

describe('Achievement Detection', () => {
  it('detects first_step badge', () => {
    const badges = detectNewBadges({ ...defaultStats, daysCompleted: 1 }, []);
    expect(badges).toContain('first_step');
  });

  it('detects week_warrior badge', () => {
    const badges = detectNewBadges({ ...defaultStats, bestStreak: 7, daysCompleted: 7 }, []);
    expect(badges).toContain('week_warrior');
    expect(badges).toContain('first_step');
  });

  it('detects month_master badge', () => {
    const badges = detectNewBadges({ ...defaultStats, bestStreak: 30, daysCompleted: 30 }, []);
    expect(badges).toContain('month_master');
    expect(badges).toContain('two_week_titan');
    expect(badges).toContain('week_warrior');
  });

  it('does not re-award earned badges', () => {
    const badges = detectNewBadges(
      { ...defaultStats, daysCompleted: 1 },
      ['first_step']
    );
    expect(badges).not.toContain('first_step');
  });

  it('detects first_workout badge', () => {
    const badges = detectNewBadges({ ...defaultStats, totalWorkouts: 1 }, []);
    expect(badges).toContain('first_workout');
  });

  it('detects fifty_workouts badge', () => {
    const badges = detectNewBadges({ ...defaultStats, totalWorkouts: 50 }, []);
    expect(badges).toContain('fifty_workouts');
    expect(badges).toContain('first_workout');
  });

  it('detects first_cardio badge', () => {
    const badges = detectNewBadges({ ...defaultStats, totalCardio: 1 }, []);
    expect(badges).toContain('first_cardio');
  });

  it('detects hydration_hero badge', () => {
    const badges = detectNewBadges({ ...defaultStats, waterStreak: 7 }, []);
    expect(badges).toContain('hydration_hero');
  });

  it('detects weight_watcher badge', () => {
    const badges = detectNewBadges({ ...defaultStats, weightLogCount: 30 }, []);
    expect(badges).toContain('weight_watcher');
  });

  it('returns empty array when no new badges earned', () => {
    const badges = detectNewBadges(defaultStats, []);
    expect(badges).toEqual([]);
  });

  it('has 14 total badge definitions', () => {
    expect(BADGES).toHaveLength(14);
  });
});
