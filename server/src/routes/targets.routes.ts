import { Router } from 'express';
import * as targetController from '../controllers/target.controller';
import { validate } from '../middleware/validate';
import { createTargetSchema, updateTargetSchema, dailyTargetSchema } from '../validators/target.validator';

const router = Router();

router.post('/', validate(createTargetSchema), targetController.create);
router.get('/', targetController.getAll);
router.put('/:id', validate(updateTargetSchema), targetController.update);
router.delete('/:id', targetController.remove);
router.post('/daily', validate(dailyTargetSchema), targetController.logDaily);

export default router;
