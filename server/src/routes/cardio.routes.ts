import { Router } from 'express';
import * as cardioController from '../controllers/cardio.controller';
import { validate } from '../middleware/validate';
import { createCardioSchema } from '../validators/cardio.validator';

const router = Router();

router.post('/', validate(createCardioSchema), cardioController.create);
router.get('/', cardioController.getByDate);
router.delete('/:id', cardioController.remove);

export default router;
