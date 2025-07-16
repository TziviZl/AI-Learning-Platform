import { Request, Response, NextFunction } from 'express';
import { ZodError, z } from 'zod';
import AppError from '../utils/AppError';

export const validate = (schema: z.ZodSchema) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);

      next();
    } catch (error: any) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map(issue => ({
          path: issue.path.join('.'),
          message: issue.message,
        }));
        return next(new AppError('Validation failed', 400, errorMessages));
      }
      next(error);
    }
  };

export const validateIdParam = (paramName: string = 'id') => {
  return (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params[paramName]);
    if (isNaN(id) || id <= 0) {
      return next(new AppError(`${paramName} must be a positive integer`, 400));
    }
    next();
  };
};
