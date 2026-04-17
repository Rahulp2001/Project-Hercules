import { Router } from 'express';
import * as workoutController from '../controllers/workout.controller';
import { validate } from '../middleware/validate';
import { createWorkoutSchema } from '../validators/workout.validator';

const router = Router();

router.post('/', validate(createWorkoutSchema), workoutController.create);
router.get('/', workoutController.getByDate);
router.get('/templates', workoutController.getTemplates);
router.get('/records', workoutController.getRecords);
router.get('/:id', workoutController.getById);
router.delete('/:id', workoutController.remove);

export default router;
