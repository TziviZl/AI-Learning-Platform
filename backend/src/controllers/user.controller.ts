import { Request, Response, NextFunction } from 'express';
import * as userService from '../services/user.service';
import logger from '../utils/logger';

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, phone, password } = req.body;
    const user = await userService.createUser(name, phone, password);
    logger.info(`Created user with phone ${phone}`);
    res.json(user);
  } catch (err) {
    logger.error(`Failed to create user with phone ${req.body.phone}: ${err}`);
    next(err);
  }
};

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
    userId = (req as any).user.userId;
    const user = await userService.updateSelf(userId, req.body);
    logger.info(`User ${userId} updated own profile with data ${JSON.stringify(req.body)}`);
    res.json(user);
  } catch (err) {
    logger.error(`User ${userId} failed to update profile: ${err}`);
    next(err);
  }
};
