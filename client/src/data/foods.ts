// Nutrition per 100g unless noted
export interface FoodItem {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  serving: number; // default serving in grams
  unit: string;    // display unit
  category: string;
}

export const FOODS: FoodItem[] = [
  // Proteins
  { name: 'Chicken Breast', calories: 165, protein: 31, carbs: 0, fats: 3.6, serving: 100, unit: 'g', category: 'Protein' },
  { name: 'Chicken Thigh', calories: 209, protein: 26, carbs: 0, fats: 11, serving: 100, unit: 'g', category: 'Protein' },
  { name: 'Ground Beef (80/20)', calories: 254, protein: 17, carbs: 0, fats: 20, serving: 100, unit: 'g', category: 'Protein' },
  { name: 'Ground Beef (90/10)', calories: 176, protein: 20, carbs: 0, fats: 10, serving: 100, unit: 'g', category: 'Protein' },
  { name: 'Salmon', calories: 208, protein: 20, carbs: 0, fats: 13, serving: 100, unit: 'g', category: 'Protein' },
  { name: 'Tuna (canned)', calories: 116, protein: 26, carbs: 0, fats: 1, serving: 100, unit: 'g', category: 'Protein' },
  { name: 'Egg (whole)', calories: 78, protein: 6, carbs: 0.6, fats: 5, serving: 60, unit: 'egg', category: 'Protein' },
  { name: 'Egg White', calories: 17, protein: 3.6, carbs: 0.2, fats: 0.1, serving: 33, unit: 'white', category: 'Protein' },
  { name: 'Shrimp', calories: 99, protein: 24, carbs: 0, fats: 0.3, serving: 100, unit: 'g', category: 'Protein' },
  { name: 'Turkey Breast', calories: 135, protein: 30, carbs: 0, fats: 1, serving: 100, unit: 'g', category: 'Protein' },
  { name: 'Pork Chop', calories: 231, protein: 25, carbs: 0, fats: 14, serving: 100, unit: 'g', category: 'Protein' },
  { name: 'Lamb', calories: 294, protein: 25, carbs: 0, fats: 21, serving: 100, unit: 'g', category: 'Protein' },
  { name: 'Tilapia', calories: 96, protein: 20, carbs: 0, fats: 2, serving: 100, unit: 'g', category: 'Protein' },
  { name: 'Cottage Cheese', calories: 98, protein: 11, carbs: 3.4, fats: 4.3, serving: 100, unit: 'g', category: 'Protein' },
  { name: 'Greek Yogurt (plain)', calories: 59, protein: 10, carbs: 3.6, fats: 0.4, serving: 100, unit: 'g', category: 'Protein' },
  { name: 'Whey Protein (1 scoop)', calories: 120, protein: 25, carbs: 3, fats: 1.5, serving: 30, unit: 'scoop', category: 'Protein' },
  { name: 'Tofu (firm)', calories: 76, protein: 8, carbs: 1.9, fats: 4.8, serving: 100, unit: 'g', category: 'Protein' },
  { name: 'Tempeh', calories: 193, protein: 19, carbs: 9, fats: 11, serving: 100, unit: 'g', category: 'Protein' },

  // Carbs / Grains
  { name: 'White Rice (cooked)', calories: 130, protein: 2.7, carbs: 28, fats: 0.3, serving: 100, unit: 'g', category: 'Carbs' },
  { name: 'Brown Rice (cooked)', calories: 123, protein: 2.7, carbs: 26, fats: 1, serving: 100, unit: 'g', category: 'Carbs' },
  { name: 'Oats (dry)', calories: 389, protein: 17, carbs: 66, fats: 7, serving: 40, unit: 'g', category: 'Carbs' },
  { name: 'Bread (white slice)', calories: 79, protein: 2.7, carbs: 15, fats: 1, serving: 30, unit: 'slice', category: 'Carbs' },
  { name: 'Bread (wheat slice)', calories: 69, protein: 3.6, carbs: 12, fats: 1, serving: 30, unit: 'slice', category: 'Carbs' },
  { name: 'Pasta (cooked)', calories: 158, protein: 5.8, carbs: 31, fats: 0.9, serving: 100, unit: 'g', category: 'Carbs' },
  { name: 'Potato (baked)', calories: 93, protein: 2.5, carbs: 21, fats: 0.1, serving: 150, unit: 'g', category: 'Carbs' },
  { name: 'Sweet Potato', calories: 86, protein: 1.6, carbs: 20, fats: 0.1, serving: 100, unit: 'g', category: 'Carbs' },
  { name: 'Quinoa (cooked)', calories: 120, protein: 4.4, carbs: 21, fats: 1.9, serving: 100, unit: 'g', category: 'Carbs' },
  { name: 'Tortilla (flour, 10")', calories: 218, protein: 5.8, carbs: 36, fats: 5.5, serving: 72, unit: 'tortilla', category: 'Carbs' },
  { name: 'Tortilla (corn, 6")', calories: 58, protein: 1.5, carbs: 12, fats: 0.7, serving: 26, unit: 'tortilla', category: 'Carbs' },
  { name: 'Bagel', calories: 245, protein: 9.5, carbs: 48, fats: 1.5, serving: 98, unit: 'bagel', category: 'Carbs' },

  // Vegetables
  { name: 'Broccoli', calories: 34, protein: 2.8, carbs: 7, fats: 0.4, serving: 100, unit: 'g', category: 'Vegetables' },
  { name: 'Spinach', calories: 23, protein: 2.9, carbs: 3.6, fats: 0.4, serving: 100, unit: 'g', category: 'Vegetables' },
  { name: 'Mixed Salad Greens', calories: 20, protein: 1.5, carbs: 3.5, fats: 0.3, serving: 100, unit: 'g', category: 'Vegetables' },
  { name: 'Bell Pepper', calories: 31, protein: 1, carbs: 6, fats: 0.3, serving: 100, unit: 'g', category: 'Vegetables' },
  { name: 'Cucumber', calories: 16, protein: 0.7, carbs: 3.6, fats: 0.1, serving: 100, unit: 'g', category: 'Vegetables' },
  { name: 'Carrot', calories: 41, protein: 0.9, carbs: 10, fats: 0.2, serving: 100, unit: 'g', category: 'Vegetables' },
  { name: 'Tomato', calories: 18, protein: 0.9, carbs: 3.9, fats: 0.2, serving: 100, unit: 'g', category: 'Vegetables' },
  { name: 'Onion', calories: 40, protein: 1.1, carbs: 9, fats: 0.1, serving: 100, unit: 'g', category: 'Vegetables' },
  { name: 'Mushrooms', calories: 22, protein: 3.1, carbs: 3.3, fats: 0.3, serving: 100, unit: 'g', category: 'Vegetables' },
  { name: 'Corn (cooked)', calories: 96, protein: 3.4, carbs: 21, fats: 1.5, serving: 100, unit: 'g', category: 'Vegetables' },
  { name: 'Green Beans', calories: 31, protein: 1.8, carbs: 7, fats: 0.1, serving: 100, unit: 'g', category: 'Vegetables' },
  { name: 'Asparagus', calories: 20, protein: 2.2, carbs: 3.9, fats: 0.1, serving: 100, unit: 'g', category: 'Vegetables' },

  // Fruits
  { name: 'Banana', calories: 89, protein: 1.1, carbs: 23, fats: 0.3, serving: 118, unit: 'banana', category: 'Fruits' },
  { name: 'Apple', calories: 52, protein: 0.3, carbs: 14, fats: 0.2, serving: 182, unit: 'apple', category: 'Fruits' },
  { name: 'Orange', calories: 47, protein: 0.9, carbs: 12, fats: 0.1, serving: 131, unit: 'orange', category: 'Fruits' },
  { name: 'Strawberries', calories: 32, protein: 0.7, carbs: 7.7, fats: 0.3, serving: 100, unit: 'g', category: 'Fruits' },
  { name: 'Blueberries', calories: 57, protein: 0.7, carbs: 14, fats: 0.3, serving: 100, unit: 'g', category: 'Fruits' },
  { name: 'Mango', calories: 60, protein: 0.8, carbs: 15, fats: 0.4, serving: 100, unit: 'g', category: 'Fruits' },
  { name: 'Grapes', calories: 69, protein: 0.7, carbs: 18, fats: 0.2, serving: 100, unit: 'g', category: 'Fruits' },
  { name: 'Avocado', calories: 160, protein: 2, carbs: 9, fats: 15, serving: 100, unit: 'g', category: 'Fruits' },
  { name: 'Pineapple', calories: 50, protein: 0.5, carbs: 13, fats: 0.1, serving: 100, unit: 'g', category: 'Fruits' },
  { name: 'Watermelon', calories: 30, protein: 0.6, carbs: 7.6, fats: 0.2, serving: 100, unit: 'g', category: 'Fruits' },

  // Dairy
  { name: 'Milk (whole)', calories: 61, protein: 3.2, carbs: 4.8, fats: 3.3, serving: 100, unit: 'ml', category: 'Dairy' },
  { name: 'Milk (skim)', calories: 34, protein: 3.4, carbs: 5, fats: 0.1, serving: 100, unit: 'ml', category: 'Dairy' },
  { name: 'Cheddar Cheese', calories: 403, protein: 25, carbs: 1.3, fats: 33, serving: 30, unit: 'g', category: 'Dairy' },
  { name: 'Mozzarella', calories: 280, protein: 28, carbs: 2.2, fats: 17, serving: 30, unit: 'g', category: 'Dairy' },
  { name: 'Butter', calories: 717, protein: 0.9, carbs: 0.1, fats: 81, serving: 10, unit: 'g', category: 'Dairy' },

  // Fats / Nuts
  { name: 'Olive Oil', calories: 884, protein: 0, carbs: 0, fats: 100, serving: 10, unit: 'ml', category: 'Fats' },
  { name: 'Peanut Butter', calories: 588, protein: 25, carbs: 20, fats: 50, serving: 32, unit: 'tbsp', category: 'Fats' },
  { name: 'Almond Butter', calories: 614, protein: 21, carbs: 19, fats: 56, serving: 32, unit: 'tbsp', category: 'Fats' },
  { name: 'Almonds', calories: 579, protein: 21, carbs: 22, fats: 50, serving: 28, unit: 'g', category: 'Fats' },
  { name: 'Walnuts', calories: 654, protein: 15, carbs: 14, fats: 65, serving: 28, unit: 'g', category: 'Fats' },
  { name: 'Cashews', calories: 553, protein: 18, carbs: 30, fats: 44, serving: 28, unit: 'g', category: 'Fats' },
  { name: 'Peanuts', calories: 567, protein: 26, carbs: 16, fats: 49, serving: 28, unit: 'g', category: 'Fats' },

  // Fast Food / Common Meals
  { name: 'Big Mac', calories: 563, protein: 26, carbs: 44, fats: 33, serving: 219, unit: 'burger', category: 'Fast Food' },
  { name: 'Cheeseburger (small)', calories: 300, protein: 15, carbs: 33, fats: 12, serving: 118, unit: 'burger', category: 'Fast Food' },
  { name: 'French Fries (medium)', calories: 320, protein: 4, carbs: 43, fats: 15, serving: 117, unit: 'serving', category: 'Fast Food' },
  { name: 'Pepperoni Pizza (slice)', calories: 298, protein: 12, carbs: 34, fats: 13, serving: 107, unit: 'slice', category: 'Fast Food' },
  { name: 'Cheese Pizza (slice)', calories: 272, protein: 11, carbs: 33, fats: 10, serving: 107, unit: 'slice', category: 'Fast Food' },
  { name: 'Fried Rice (restaurant)', calories: 238, protein: 5.4, carbs: 42, fats: 5.4, serving: 200, unit: 'g', category: 'Fast Food' },
  { name: 'Chicken Nuggets (6pc)', calories: 280, protein: 14, carbs: 18, fats: 17, serving: 100, unit: '6 pcs', category: 'Fast Food' },

  // Drinks
  { name: 'Orange Juice', calories: 45, protein: 0.7, carbs: 10, fats: 0.2, serving: 100, unit: 'ml', category: 'Drinks' },
  { name: 'Coca-Cola', calories: 42, protein: 0, carbs: 11, fats: 0, serving: 100, unit: 'ml', category: 'Drinks' },
  { name: 'Protein Shake (avg)', calories: 150, protein: 30, carbs: 6, fats: 3, serving: 300, unit: 'shake', category: 'Drinks' },

  // Snacks
  { name: 'Rice Cakes', calories: 35, protein: 0.7, carbs: 7.3, fats: 0.3, serving: 9, unit: 'cake', category: 'Snacks' },
  { name: 'Protein Bar (avg)', calories: 200, protein: 20, carbs: 22, fats: 7, serving: 60, unit: 'bar', category: 'Snacks' },
  { name: 'Granola Bar', calories: 193, protein: 3.6, carbs: 29, fats: 7.6, serving: 47, unit: 'bar', category: 'Snacks' },
  { name: 'Dark Chocolate (70%)', calories: 598, protein: 7.8, carbs: 46, fats: 43, serving: 30, unit: 'g', category: 'Snacks' },
  { name: 'Chips (potato)', calories: 536, protein: 7, carbs: 53, fats: 35, serving: 30, unit: 'g', category: 'Snacks' },
  { name: 'Popcorn (plain)', calories: 375, protein: 11, carbs: 74, fats: 4.5, serving: 30, unit: 'g', category: 'Snacks' },

  // Legumes
  { name: 'Black Beans (cooked)', calories: 132, protein: 8.9, carbs: 24, fats: 0.5, serving: 100, unit: 'g', category: 'Legumes' },
  { name: 'Chickpeas (cooked)', calories: 164, protein: 8.9, carbs: 27, fats: 2.6, serving: 100, unit: 'g', category: 'Legumes' },
  { name: 'Lentils (cooked)', calories: 116, protein: 9, carbs: 20, fats: 0.4, serving: 100, unit: 'g', category: 'Legumes' },
  { name: 'Edamame', calories: 121, protein: 11, carbs: 8.9, fats: 5.2, serving: 100, unit: 'g', category: 'Legumes' },
];

export function searchFoods(query: string): FoodItem[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return FOODS.filter((f) => f.name.toLowerCase().includes(q)).slice(0, 8);
}

export function calcNutrition(food: FoodItem, quantity: number) {
  const ratio = quantity / food.serving;
  return {
    calories: Math.round(food.calories * ratio),
    protein: Math.round(food.protein * ratio * 10) / 10,
    carbs: Math.round(food.carbs * ratio * 10) / 10,
    fats: Math.round(food.fats * ratio * 10) / 10,
  };
}
