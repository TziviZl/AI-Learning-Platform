import prisma from '../prismaClient';
import logger from '../utils/logger';

export const listUsers = async () => {
  logger.debug('Fetching all users from DB');
  return prisma.user.findMany();
};

export const listUserPrompts = async (userId: number) => {
  logger.debug(`Fetching prompts for user ${userId} from DB`);
  return prisma.prompt.findMany({
    where: { userId },
    include: { category: true, subCategory: true },
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
