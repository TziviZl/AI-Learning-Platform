import express from 'express';
import { listUsers, listUserPrompts, updateUser, deleteUser } from '../controllers/admin.controller';
import { validateIdParam, validate } from '../middleware/validateRequest';
import { checkUserExists } from '../middleware/db.middleware';
import { authenticate, authorizeAdmin } from '../middleware/auth.middleware';
import { adminUpdateUserSchema } from '../schemas/authSchemas';

const router = express.Router();

router.use(authenticate, authorizeAdmin);

router.get('/users', listUsers);

router.get(
  '/users/:id/prompts',
  validateIdParam('id'),
  checkUserExists('id'),
  listUserPrompts
);

router.patch(
  '/users/:id',
  validateIdParam('id'),
  validate(adminUpdateUserSchema),
  checkUserExists('id'),
  updateUser
);

router.delete(
  '/users/:id',
  validateIdParam('id'),
  checkUserExists('id'),
  deleteUser
);

export default router;
