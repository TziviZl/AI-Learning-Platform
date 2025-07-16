import { Request, Response, NextFunction } from 'express';
import * as userService from '../services/user.service';
import logger from '../utils/logger';

// Removed createUser function from here.
// User creation (registration) is handled by auth.controller.ts and auth.service.ts.

export const getUserPrompts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = parseInt(req.params.id);
    const prompts = await userService.getUserPrompts(userId);
    logger.info(`Fetched prompts for user ${userId}`);
    res.json(prompts);
  } catch (err) {
    logger.error(`Failed to fetch prompts for user ${req.params.id}: ${err}`);
    next(err);
  }
};

export const updateSelf = async (req: Request, res: Response, next: NextFunction) => {
  let userId;
  try {
    userId = (req as any).user.userId; // Assuming userId is attached by auth middleware
    const user = await userService.updateSelf(userId, req.body);

    if (!user) {
      logger.warn(`User ${userId} attempted to update non-existent profile.`);
      return res.status(404).json({ message: 'User not found or unable to update.' });
    }

    logger.info(`User ${userId} updated own profile with data ${JSON.stringify(req.body)}`);
    res.json({ user });
  } catch (err) {
    logger.error(`User ${userId} failed to update profile: ${err}`);
    next(err);
  }
};
