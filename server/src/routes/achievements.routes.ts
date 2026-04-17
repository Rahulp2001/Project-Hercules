import { Router } from 'express';
import * as achievementController from '../controllers/achievement.controller';

const router = Router();

router.get('/', achievementController.getAchievements);

export default router;
