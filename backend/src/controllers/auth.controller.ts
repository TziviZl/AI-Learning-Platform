import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service'; // Import authService
import logger from '../utils/logger';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, phone, password } = req.body;
    const { user, token } = await authService.createUser(name, phone, password);
    logger.info(`User registered: ${user.id}`);
    res.status(201).json({ user, token });
  } catch (error) {
    logger.error(`Registration failed: ${error}`);
    next(error); 
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { phone, password } = req.body;
    const { user, token } = await authService.login(phone, password);
    logger.info(`User logged in: ${user.id}`);
    res.status(200).json({ user, token });
  } catch (error) {
    logger.error(`Login failed: ${error}`);
    next(error); 
  }
};
