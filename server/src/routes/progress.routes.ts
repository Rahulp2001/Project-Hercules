import { Router } from 'express';
import * as progressController from '../controllers/progress.controller';

const router = Router();

router.get('/weight', progressController.getWeightTrend);
router.get('/calories', progressController.getCalorieTrend);
router.get('/macros', progressController.getMacroAverages);
router.get('/completion', progressController.getCompletion);
router.get('/habits', progressController.getHabits);
router.get('/summary', progressController.getWeeklySummary);

export default router;
