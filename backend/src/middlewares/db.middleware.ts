import { Request, Response, NextFunction } from 'express';
import prisma from '../prismaClient';
import AppError from '../utils/AppError';
import logger from '../utils/logger';

export const checkUserExists = (paramName: string) => async (req: Request, res: Response, next: NextFunction) => {
  const id = parseInt(req.params[paramName]);
  if (isNaN(id)) {
    return next(new AppError(`Invalid ID parameter: ${paramName}`, 400));
  }
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    return next(new AppError('User not found', 404));
  }
  next();
};

export const checkCategoryExists = () => async (req: Request, res: Response, next: NextFunction) => {
  const categoryId = parseInt(req.params.id);
  if (isNaN(categoryId)) {
    return next(new AppError('Invalid category ID parameter', 400));
  }
  const category = await prisma.category.findUnique({ where: { id: categoryId } });
  if (!category) {
    return next(new AppError('Category not found', 404));
  }
  next();
};

export const ensurePhoneUnique = () => async (req: Request, res: Response, next: NextFunction) => {
  const { phone } = req.body;
  if (!phone) {
    return next(new AppError('Phone number is required for registration', 400));
  }
  const existingUser = await prisma.user.findUnique({ where: { phone } });
  if (existingUser) {
    logger.warn(`Registration attempt with existing phone number: ${phone}`);
    throw new AppError('Phone number already registered', 409); 
  }
  next();
};
