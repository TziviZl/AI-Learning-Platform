import { Router } from 'express';

const router = Router();

router.get('/users', (req, res) => {
  // list all users
  res.json([{ id: 1, name: 'Israel' }]);
});

router.get('/users/:id/prompts', (req, res) => {
  // list prompt history for user
  res.json([{ prompt: 'Teach me about black holes', response: '...' }]);
});

export default router;
