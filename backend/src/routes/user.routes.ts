import express from 'express';
import { getUserPrompts, updateSelf } from '../controllers/user.controller'; // createUser removed from import
import { validateIdParam, validate } from '../middleware/validateRequest';
import { authenticate } from '../middleware/auth.middleware';
import { updateProfileSchema } from '../schemas/authSchemas'; // registerSchema removed from import

const router = express.Router();

// Removed the POST / route for user creation.
// User registration is handled by /api/auth/register.

router.get(
  '/:id/prompts',
  validateIdParam(),
  getUserPrompts
);

router.patch(
  '/me',
  authenticate,
  validate(updateProfileSchema),
  updateSelf
);

export default router;
