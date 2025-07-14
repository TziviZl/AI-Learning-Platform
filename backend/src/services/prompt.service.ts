import prisma from '../prismaClient';
import { generateLesson } from './openai.service';
import logger from '../utils/logger';

export const createPrompt = async (userId: number, categoryId: number, subCategoryId: number, promptText: string) => {
  logger.debug(`Creating prompt for user ${userId} in category ${categoryId}/${subCategoryId}`);

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    logger.warn(`User ${userId} does not exist`);
    throw new Error(`User with id ${userId} does not exist`);
  }

  const category = await prisma.category.findUnique({ where: { id: categoryId } });
  if (!category) {
    logger.warn(`Category ${categoryId} does not exist`);
    throw new Error(`Category with id ${categoryId} does not exist`);
  }

  const subCategory = await prisma.subCategory.findFirst({
    where: {
      id: subCategoryId,
      categoryId: categoryId,
    },
  });
  if (!subCategory) {
    logger.warn(`SubCategory ${subCategoryId} does not exist under Category ${categoryId}`);
    throw new Error(`SubCategory with id ${subCategoryId} does not exist under Category ${categoryId}`);
  }

  const response = await generateLesson(promptText);

  return prisma.prompt.create({
    data: {
      userId,
      categoryId,
      subCategoryId,
      prompt: promptText,
      response,
    },
  });
};
