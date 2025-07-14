import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

export function validateBodyFields(requiredFields: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const missingFields = requiredFields.filter(field => !(field in req.body));
    if (missingFields.length > 0) {
      logger.warn(`Validation failed - missing fields: ${missingFields.join(', ')}`);
      return res.status(400).json({
        error: `Missing required fields: ${missingFields.join(', ')}`
      });
    }
    next();
  };
}

export function validatePhoneField(field: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const value = req.body[field];
    if (!/^\d{10}$/.test(value)) {
      logger.warn(`Validation failed - invalid phone for field ${field}: ${value}`);
      return res.status(400).json({
        error: `${field} must be a valid 10-digit phone number`
      });
    }
    next();
  };
}

export function validateIdParam(paramName: string = 'id') {
  return (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params[paramName]);
    if (isNaN(id) || id <= 0) {
      logger.warn(`Validation failed - invalid id param ${paramName}: ${req.params[paramName]}`);
      return res.status(400).json({
        error: `${paramName} must be a positive integer`
      });
    }
    next();
  };
}
