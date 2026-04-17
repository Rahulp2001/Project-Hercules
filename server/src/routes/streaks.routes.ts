import { Router } from 'express';
import * as achievementController from '../controllers/achievement.controller';

const router = Router();

router.get('/', achievementController.getStreaks);

export default router;
