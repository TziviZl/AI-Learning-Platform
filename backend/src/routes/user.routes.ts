
import { Router } from 'express';

const router = Router();

router.post('/', (req, res) => {
  // register user
  res.json({ message: 'User created' });
});

router.get('/:id', (req, res) => {
  // get user by id
  res.json({ message: 'User info' });
});

export default router;
