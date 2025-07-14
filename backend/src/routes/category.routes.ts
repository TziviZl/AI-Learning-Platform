
import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  // list categories
  res.json([{ id: 1, name: 'Science' }]);
});

router.get('/:id/sub-categories', (req, res) => {
  // list sub categories by category id
  res.json([{ id: 1, name: 'Space' }]);
});

export default router;
