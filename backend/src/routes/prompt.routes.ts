
import { Router } from 'express';
import { generateLesson } from '../services/openai.service';

const router = Router();

router.post('/', async (req, res) => {
  const { prompt } = req.body;
  const lesson = await generateLesson(prompt);
  res.json({ lesson });
});

export default router;
