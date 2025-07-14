import { Request, Response, NextFunction } from 'express';
import prisma from '../prismaClient';
import logger from '../utils/logger';

export function checkUserExists(paramName: string = 'id') {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userId = parseInt(req.params[paramName]);
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      logger.warn(`DB check failed - user ${userId} not found`);
      return res.status(404).json({ error: `User with id ${userId} does not exist` });
    }
    next();
  };
}

export function checkCategoryExists(paramName: string = 'id') {
  return async (req: Request, res: Response, next: NextFunction) => {
    const categoryId = parseInt(req.params[paramName]);
    const category = await prisma.category.findUnique({ where: { id: categoryId } });
    if (!category) {
      logger.warn(`DB check failed - category ${categoryId} not found`);
      return res.status(404).json({ error: `Category with id ${categoryId} does not exist` });
    }
    next();
  };
}

export function checkSubCategoryExists(paramName: string = 'id') {
  return async (req: Request, res: Response, next: NextFunction) => {
    const subCategoryId = parseInt(req.params[paramName]);
    const subCategory = await prisma.subCategory.findUnique({ where: { id: subCategoryId } });
    if (!subCategory) {
      logger.warn(`DB check failed - subCategory ${subCategoryId} not found`);
      return res.status(404).json({ error: `SubCategory with id ${subCategoryId} does not exist` });
    }
    next();
  };
}

export function ensurePhoneUnique(field: string = 'phone') {
  return async (req: Request, res: Response, next: NextFunction) => {
    const phone = req.body[field];
    const existing = await prisma.user.findUnique({ where: { phone } });
    if (existing) {
      logger.warn(`DB check failed - phone ${phone} already exists`);
      return res.status(409).json({ error: `Phone number ${phone} already exists` });
    }
    next();
  };
}
