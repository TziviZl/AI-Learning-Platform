import express from 'express';
import { getCategories, getSubCategories } from '../controllers/category.controller';
import { validateIdParam } from '../middleware/validateRequest';
import { checkCategoryExists } from '../middleware/db.middleware';

const router = express.Router();

router.get('/', getCategories);

router.get(
  '/:id/sub-categories',
  validateIdParam(),
  checkCategoryExists(),
  getSubCategories
);

export default router;
