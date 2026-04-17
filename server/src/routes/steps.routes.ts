import { Router } from 'express';
import * as trackerController from '../controllers/tracker.controller';
import { validate } from '../middleware/validate';
import { stepLogSchema } from '../validators/tracker.validator';

const router = Router();

router.post('/', validate(stepLogSchema), trackerController.logSteps);
router.get('/', trackerController.getSteps);

export default router;
