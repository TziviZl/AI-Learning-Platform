import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { validate } from '../middlewares/validateRequest'; // Import the validation middleware
import { registerSchema, loginSchema } from '../schemas/authSchemas'; // Import the schemas
import { ensurePhoneUnique } from '../middlewares/db.middleware'; // Import the middleware to check phone uniqueness

const router = Router();

router.post(
  '/register',
  validate(registerSchema), 
  ensurePhoneUnique(),      
  authController.register 
);

// Route for user login
router.post('/login', validate(loginSchema), authController.login);

export default router;
