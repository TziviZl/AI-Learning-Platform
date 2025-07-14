import express from 'express';
import { createUser, getUserPrompts, updateSelf } from '../controllers/user.controller';
import { validateBodyFields, validatePhoneField, validateIdParam } from '../middleware/validate';
import { ensurePhoneUnique } from '../middleware/dbCheck';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.post(
  '/',
  validateBodyFields(['name', 'phone', 'password']),
  validatePhoneField('phone'),
  ensurePhoneUnique(),
  createUser
);

router.get(
  '/:id/prompts',
  validateIdParam(),
  getUserPrompts
);

router.patch(
  '/me',
  authenticate,
  updateSelf
);

export default router;
