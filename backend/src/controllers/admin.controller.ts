import { Request, Response, NextFunction } from 'express';
import * as adminService from '../services/admin.service';
import logger from '../utils/logger';
import AppError from '../utils/AppError';

interface ListUsersRequest extends Request {
  query: {
    page?: string;
    limit?: string;
    role?: 'user' | 'admin' | '';
    search?: string;
  };
}

export const listUsers = async (req: ListUsersRequest, res: Response, next: NextFunction) => {
  try {
    const page = req.query.page ? parseInt(req.query.page) : undefined;
    const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
    const role = req.query.role;
    const search = req.query.search;

    const { users, totalCount } = await adminService.listUsers({ page, limit, role, search });
    logger.info(`Admin listed users with filters. Total: ${totalCount}`);
    res.json({ users, totalCount });
  } catch (err) {
    logger.error(`Failed to list users: ${err}`);
    next(err);
  }
};

export const listUserPrompts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = parseInt(req.params.id);
    const prompts = await adminService.listUserPrompts(userId);
    logger.info(`Admin fetched prompts for user ${userId}`);
    res.json(prompts);
  } catch (err) {
    logger.error(`Failed to fetch prompts for user ${req.params.id}: ${err}`);
    next(err);
  }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = parseInt(req.params.id);
    const user = await adminService.updateUser(userId, req.body);
    logger.info(`Admin updated user ${userId} with data ${JSON.stringify(req.body)}`);
    res.json(user);
  } catch (err) {
    logger.error(`Failed to update user ${req.params.id}: ${err}`);
    next(err);
  }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = parseInt(req.params.id);
    await adminService.deleteUser(userId);
    logger.info(`Admin deleted user ${userId}`);
    res.json({ message: `User ${userId} deleted` });
  } catch (err) {
    logger.error(`Failed to delete user ${req.params.id}: ${err}`);
    next(err);
  }
};
