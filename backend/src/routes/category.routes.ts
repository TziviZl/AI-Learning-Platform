import express from 'express';
import { getCategories, getSubCategories } from '../controllers/category.controller';
import { validateIdParam } from '../middlewares/validateRequest';
import { checkCategoryExists } from '../middlewares/db.middleware';

const router = express.Router();

router.get('/', getCategories);

router.get(
  '/:id/sub-categories',
  validateIdParam(),
  checkCategoryExists(),
  getSubCategories
);

export default router;
