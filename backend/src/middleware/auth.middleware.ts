import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import logger from '../utils/logger';
import AppError from '../utils/AppError'; // Import the custom AppError

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number;
        role: string;
        iat: number;
        exp: number;
      };
    }
  }
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    logger.warn('Authentication failed - no token provided or malformed header');
    return next(new AppError('No token provided or malformed header. Access denied.', 401));
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number; role: string; iat: number; exp: number; };
    req.user = payload;
    logger.info(`Authenticated user with ID: ${payload.userId}, Role: ${payload.role}`);
    next(); 
  } catch (err: any) {
    logger.warn(`Authentication failed - invalid token: ${err.message}`);
    return next(new AppError('Invalid or expired token. Access denied.', 401));
  }
};

export const authorizeAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'ADMIN') {
    logger.warn(`Authorization failed - user ${req.user?.userId || 'N/A'} is not ADMIN`);
    return next(new AppError('Admin privileges required. Access denied.', 403));
  }
  logger.info(`Authorized admin user ID: ${req.user.userId}`);
  next();
};
