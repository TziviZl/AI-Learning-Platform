import prisma from '../prismaClient';
import logger from '../utils/logger';

export const getCategories = async () => {
  logger.debug('Fetching all categories from DB');
  return prisma.category.findMany();
};

export const getSubCategories = async (categoryId: number) => {
  logger.debug(`Fetching subcategories for category ${categoryId} from DB`);
  return prisma.subCategory.findMany({
    where: { categoryId },
  });
};
