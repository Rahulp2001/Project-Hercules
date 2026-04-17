import { describe, it, expect } from 'vitest';
import { estimateCaloriesBurned } from '../../src/utils/met';

describe('MET Calorie Estimation', () => {
  it('estimates running calories correctly', () => {
    // MET 9.8 * 75kg * 0.5hr = 367.5 → 368
    const calories = estimateCaloriesBurned('running', 30, 75);
    expect(calories).toBe(368);
  });

  it('estimates cycling calories correctly', () => {
    // MET 7.5 * 70kg * 1hr = 525
    const calories = estimateCaloriesBurned('cycling', 60, 70);
    expect(calories).toBe(525);
  });

  it('estimates swimming calories correctly', () => {
    // MET 8.0 * 80kg * 0.75hr = 480
    const calories = estimateCaloriesBurned('swimming', 45, 80);
    expect(calories).toBe(480);
  });

  it('estimates walking calories correctly', () => {
    // MET 3.8 * 65kg * 1hr = 247
    const calories = estimateCaloriesBurned('walking', 60, 65);
    expect(calories).toBe(247);
  });

  it('estimates jump rope calories correctly', () => {
    // MET 12.3 * 70kg * 0.25hr = 215.25 → 215
    const calories = estimateCaloriesBurned('jumprope', 15, 70);
    expect(calories).toBe(215);
  });

  it('uses default MET for unknown activity', () => {
    // MET 5.0 * 70kg * 0.5hr = 175
    const calories = estimateCaloriesBurned('dancing', 30, 70);
    expect(calories).toBe(175);
  });

  it('returns 0 for 0 duration', () => {
    const calories = estimateCaloriesBurned('running', 0, 75);
    expect(calories).toBe(0);
  });
});
