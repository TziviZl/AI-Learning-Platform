import express from 'express';
import { listUsers, listUserPrompts, updateUser, deleteUser } from '../controllers/admin.controller';
import { validateIdParam } from '../middleware/validate';
import { checkUserExists } from '../middleware/dbCheck';
import { authenticate, authorizeAdmin } from '../middleware/auth';

const router = express.Router();

router.get('/users', authenticate, authorizeAdmin, listUsers);

router.get('/users/:id/prompts',
  authenticate, authorizeAdmin,
  validateIdParam(),
  checkUserExists(),
  listUserPrompts
);

router.patch('/users/:id',
  authenticate, authorizeAdmin,
  validateIdParam(),
  checkUserExists(),
  updateUser
);

router.delete('/users/:id',
  authenticate, authorizeAdmin,
  validateIdParam(),
  checkUserExists(),
  deleteUser
);

export default router;
