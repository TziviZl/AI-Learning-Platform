import express from 'express';
import { createPrompt } from '../controllers/prompt.controller';
import { validateBodyFields } from '../middleware/validate';

const router = express.Router();

router.post(
  '/',
  validateBodyFields(['userId', 'categoryId', 'subCategoryId', 'promptText']),
  createPrompt
);

export default router;
