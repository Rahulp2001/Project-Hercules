import { Router } from 'express';
import * as mealController from '../controllers/meal.controller';
import { validate } from '../middleware/validate';
import { createMealSchema, updateMealSchema } from '../validators/meal.validator';

const router = Router();

router.post('/', validate(createMealSchema), mealController.create);
router.get('/', mealController.getByDate);
router.get('/favorites', mealController.getFavorites);
router.get('/recent', mealController.getRecent);
router.put('/:id', validate(updateMealSchema), mealController.update);
router.delete('/:id', mealController.remove);

export default router;
