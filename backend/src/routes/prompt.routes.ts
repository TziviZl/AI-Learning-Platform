import express from 'express';
import { createPrompt } from '../controllers/prompt.controller';
import { validate } from '../middleware/validateRequest';
import { createPromptSchema } from '../schemas/promptSchemas'; 
import { authenticate } from '../middleware/auth.middleware';

const router = express.Router();

router.post(
  '/',
  authenticate, 
  validate(createPromptSchema),
  createPrompt
);

export default router;
