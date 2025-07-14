import { Request, Response, NextFunction } from 'express';
import * as categoryService from '../services/category.service';
import logger from '../utils/logger';

export const getCategories = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await categoryService.getCategories();
    logger.info(`Fetched all categories`);
    res.json(categories);
  } catch (err) {
    logger.error(`Failed to fetch categories: ${err}`);
    next(err);
  }
};

export const getSubCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categoryId = parseInt(req.params.id);
    const subCategories = await categoryService.getSubCategories(categoryId);
    logger.info(`Fetched subcategories for category ${categoryId}`);
    res.json(subCategories);
  } catch (err) {
    logger.error(`Failed to fetch subcategories for category ${req.params.id}: ${err}`);
    next(err);
  }
};
