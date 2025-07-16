import prisma from '../prismaClient';
import logger from '../utils/logger';
import { User, Prisma } from '@prisma/client'; // Import Prisma for SortOrder

interface ListUsersParams {
  page?: number;
  limit?: number;
  role?: 'user' | 'admin' | '';
  search?: string;
}

export const listUsers = async (params: ListUsersParams = {}): Promise<{ users: User[]; totalCount: number }> => {
  logger.debug('Fetching all users from DB with pagination and filters');

  const { page = 1, limit = 10, role, search } = params;
  const skip = (page - 1) * limit;

  const where: any = {};
  // Fix 2: Removed redundant '&& role !== ""' check.
  // 'if (role)' correctly handles 'user', 'admin' (truthy) and '' (falsy).
  if (role) {
    where.role = role.toUpperCase();
  }
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { phone: { contains: search, mode: 'insensitive' } },
    ];
  }

  const users = await prisma.user.findMany({
    where,
    skip,
    take: limit,
    orderBy: { createdAt: Prisma.SortOrder.desc },
  });

  const totalCount = await prisma.user.count({ where });

  return { users, totalCount };
};

export const listUserPrompts = async (userId: number) => {
  logger.debug(`Fetching prompts for user ${userId} from DB`);
  return prisma.prompt.findMany({
    where: { userId },
    include: { category: true, subCategory: true },
    orderBy: { createdAt: Prisma.SortOrder.desc }, 
  });
};

export const updateUser = async (userId: number, data: { name?: string; phone?: string; role?: string }) => {
  logger.debug(`Updating user ${userId} with data ${JSON.stringify(data)}`);
  return prisma.user.update({
    where: { id: userId },
    data,
  });
};

export const deleteUser = async (userId: number) => {
  logger.debug(`Deleting prompts and user ${userId} from DB`);
  await prisma.prompt.deleteMany({ where: { userId } });
  return prisma.user.delete({ where: { id: userId } });
};
