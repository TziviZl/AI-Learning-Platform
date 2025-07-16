import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';
import AppError from '../utils/AppError'; 
import { Prisma } from '@prisma/client'; 
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken'; 

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let details = err.details; // For validation errors, etc.

  if (statusCode === 500) {
    logger.error(`Unhandled Server Error: ${err.stack || err}`);
  } else {
    logger.warn(`Operational Error: ${err.message}, Status: ${statusCode}, Path: ${req.path}`);
  }

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    details = err.details;
  } else if (err instanceof JsonWebTokenError) {
    statusCode = 401;
    message = 'Invalid Token. Please log in again.';
  } else if (err instanceof TokenExpiredError) {
    statusCode = 401;
    message = 'Token has expired. Please log in again.';
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      statusCode = 409; 
      message = `Duplicate field value: ${err.meta?.target}. Please use another value.`;
      details = { target: err.meta?.target };
    } else if (err.code === 'P2025') {
      statusCode = 404; 
      message = `Resource not found: ${err.meta?.cause || 'record not found'}.`;
      details = { cause: err.meta?.cause };
    }
  } else if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 400;
    message = `Invalid ID: ${err.value}.`;
  }
  res.status(statusCode).json({
    status: `${statusCode}`.startsWith('4') ? 'fail' : 'error',
    message: message,
    ...(details && { details: details }),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
}
