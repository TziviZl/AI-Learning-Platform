import { Request, Response, NextFunction } from 'express';
import * as promptService from '../services/prompt.service';
import logger from '../utils/logger';

export const createPrompt = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, categoryId, subCategoryId, promptText } = req.body;
    const data = await promptService.createPrompt(userId, categoryId, subCategoryId, promptText);
    logger.info(`Created prompt for user ${userId} on ${categoryId}/${subCategoryId}`);
    res.json(data);
  } catch (err) {
    logger.error(`Failed to create prompt: ${err}`);
    next(err);
  }
};
