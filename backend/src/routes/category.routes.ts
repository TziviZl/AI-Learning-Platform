import express from 'express';
import { getCategories, getSubCategories } from '../controllers/category.controller';
import { validateIdParam } from '../middleware/validate';
import { checkCategoryExists } from '../middleware/dbCheck';

const router = express.Router();

router.get('/', getCategories);

router.get('/:id/sub-categories',
  validateIdParam(),
  checkCategoryExists(),
  getSubCategories
);

export default router;
