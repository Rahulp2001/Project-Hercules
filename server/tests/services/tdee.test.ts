import { describe, it, expect } from 'vitest';
import {
  calculateBMR,
  calculateTDEE,
  calculateCalorieTarget,
  calculateMacros,
} from '../../src/utils/tdee';

describe('TDEE Calculations', () => {
  describe('calculateBMR', () => {
    it('calculates BMR for male correctly', () => {
      // Mifflin-St Jeor: 10*75 + 6.25*175 - 5*25 + 5 = 750 + 1093.75 - 125 + 5 = 1723.75
      const bmr = calculateBMR(75, 175, 25, 'male');
      expect(bmr).toBeCloseTo(1723.75, 1);
    });

    it('calculates BMR for female correctly', () => {
      // Mifflin-St Jeor: 10*60 + 6.25*165 - 5*30 - 161 = 600 + 1031.25 - 150 - 161 = 1320.25
      const bmr = calculateBMR(60, 165, 30, 'female');
      expect(bmr).toBeCloseTo(1320.25, 1);
    });

    it('uses female formula for "other" gender', () => {
      const bmr = calculateBMR(70, 170, 28, 'other');
      const expected = 10 * 70 + 6.25 * 170 - 5 * 28 - 161;
      expect(bmr).toBeCloseTo(expected, 1);
    });
  });

  describe('calculateTDEE', () => {
    it('applies sedentary multiplier (1.2)', () => {
      expect(calculateTDEE(1700, 'sedentary')).toBe(Math.round(1700 * 1.2));
    });

    it('applies light multiplier (1.375)', () => {
      expect(calculateTDEE(1700, 'light')).toBe(Math.round(1700 * 1.375));
    });

    it('applies moderate multiplier (1.55)', () => {
      expect(calculateTDEE(1700, 'moderate')).toBe(Math.round(1700 * 1.55));
    });

    it('applies very active multiplier (1.725)', () => {
      expect(calculateTDEE(1700, 'very')).toBe(Math.round(1700 * 1.725));
    });

    it('applies extreme multiplier (1.9)', () => {
      expect(calculateTDEE(1700, 'extreme')).toBe(Math.round(1700 * 1.9));
    });

    it('defaults to moderate for unknown activity level', () => {
      expect(calculateTDEE(1700, 'unknown')).toBe(Math.round(1700 * 1.55));
    });
  });

  describe('calculateCalorieTarget', () => {
    it('applies 20% deficit for cut', () => {
      expect(calculateCalorieTarget(2500, 'cut')).toBe(2000);
    });

    it('applies 15% surplus for bulk', () => {
      expect(calculateCalorieTarget(2500, 'bulk')).toBe(2875);
    });

    it('returns TDEE for maintain', () => {
      expect(calculateCalorieTarget(2500, 'maintain')).toBe(2500);
    });
  });

  describe('calculateMacros', () => {
    it('calculates macro grams correctly', () => {
      const macros = calculateMacros(2000, 30, 40, 30);
      // Protein: (2000 * 0.30) / 4 = 150g
      // Carbs: (2000 * 0.40) / 4 = 200g
      // Fats: (2000 * 0.30) / 9 = 66.67 → 67g
      expect(macros.proteinGrams).toBe(150);
      expect(macros.carbsGrams).toBe(200);
      expect(macros.fatsGrams).toBe(67);
    });

    it('handles high protein split', () => {
      const macros = calculateMacros(3000, 40, 35, 25);
      expect(macros.proteinGrams).toBe(300);
      expect(macros.carbsGrams).toBe(263);
      expect(macros.fatsGrams).toBe(83);
    });
  });
});
