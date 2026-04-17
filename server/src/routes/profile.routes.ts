import { Router } from 'express';
import * as profileController from '../controllers/profile.controller';
import { validate } from '../middleware/validate';
import { createProfileSchema, updateProfileSchema } from '../validators/profile.validator';

const router = Router();

router.post('/', validate(createProfileSchema), profileController.create);
router.get('/:id', profileController.get);
router.put('/:id', validate(updateProfileSchema), profileController.update);

export default router;
