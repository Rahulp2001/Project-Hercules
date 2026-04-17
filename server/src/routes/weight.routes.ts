import { Router } from 'express';
import * as trackerController from '../controllers/tracker.controller';
import { validate } from '../middleware/validate';
import { weightLogSchema } from '../validators/tracker.validator';

const router = Router();

router.post('/', validate(weightLogSchema), trackerController.logWeight);
router.get('/', trackerController.getWeightHistory);

export default router;
