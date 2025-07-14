import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import logger from '../utils/logger';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    logger.warn('Authentication failed - no token provided');
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!);
    (req as any).user = payload;
    logger.info(`Authenticated user with payload: ${JSON.stringify(payload)}`);
    next();
  } catch (err) {
    logger.warn('Authentication failed - invalid token');
    return res.status(401).json({ error: 'Invalid token' });
  }
};

export const authorizeAdmin = (req: Request, res: Response, next: NextFunction) => {
  if ((req as any).user?.role !== 'ADMIN') {
    logger.warn(`Authorization failed - user is not ADMIN`);
    return res.status(403).json({ error: 'Admin privileges required' });
  }
  logger.info(`Authorized admin`);
  next();
};
