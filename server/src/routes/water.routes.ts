import { Router } from 'express';
import * as trackerController from '../controllers/tracker.controller';
import { validate } from '../middleware/validate';
import { waterLogSchema } from '../validators/tracker.validator';

const router = Router();

router.post('/', validate(waterLogSchema), trackerController.logWater);
router.get('/', trackerController.getWater);

export default router;
