import { Router } from 'express';
import * as trackerController from '../controllers/tracker.controller';
import { validate } from '../middleware/validate';
import { sleepLogSchema } from '../validators/tracker.validator';

const router = Router();

router.post('/', validate(sleepLogSchema), trackerController.logSleep);
router.get('/', trackerController.getSleep);

export default router;
