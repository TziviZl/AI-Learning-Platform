import express from 'express';
import { createPrompt } from '../controllers/prompt.controller';
import { validate } from '../middlewares/validateRequest';
import { createPromptSchema } from '../schemas/promptSchemas'; 
import { authenticate } from '../middlewares/auth.middleware';

const router = express.Router();

router.post(
  '/',
  authenticate, 
  validate(createPromptSchema),
  createPrompt
);

export default router;
