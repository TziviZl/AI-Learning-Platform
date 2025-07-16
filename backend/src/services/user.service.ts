import prisma from '../prismaClient';
import logger from '../utils/logger';
import bcrypt from 'bcryptjs'; // Changed from 'bcrypt' to 'bcryptjs' for consistency if needed

interface UpdateUserData {
  name?: string;
  phone?: string;
  currentPassword?: string;
  newPassword?: string;
}

// Removed createUser function from here.
// User creation (registration) is now handled by auth.service.ts.

export const getUserPrompts = async (userId: number) => {
  logger.debug(`Fetching prompts for user ${userId}`);
  return prisma.prompt.findMany({
    where: { userId },
    include: { category: true, subCategory: true },
    orderBy: { createdAt: 'desc' }, // Assuming 'desc' is the desired order
  });
};

export const updateSelf = async (userId: number, data: UpdateUserData) => {
  logger.debug(`Updating user ${userId} profile with data: ${JSON.stringify(data)}`);

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    logger.warn(`Attempted to update non-existent user with ID: ${userId}`);
    throw new Error('User not found.'); // Consider using AppError for consistency
  }

  const updatePayload: { name?: string; phone?: string; password?: string } = {};

  if (data.name !== undefined) {
    updatePayload.name = data.name;
  }

  if (data.phone !== undefined) {
    updatePayload.phone = data.phone;
  }

  if (data.newPassword) {
    if (!data.currentPassword) {
      logger.warn(`User ${userId} attempted to change password without providing current password.`);
      throw new Error('Current password is required to change password.'); // Consider using AppError
    }

    const isCurrentPasswordValid = await bcrypt.compare(data.currentPassword, user.password);

    if (!isCurrentPasswordValid) {
      logger.warn(`User ${userId} provided an incorrect current password.`);
      throw new Error('Incorrect current password.'); // Consider using AppError
    }

    updatePayload.password = await bcrypt.hash(data.newPassword, 10);
    logger.debug(`User ${userId} new password hashed.`);
  }

  try {
    if (Object.keys(updatePayload).length === 0) {
      logger.info(`User ${userId} profile update requested, but no changes detected.`);
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updatePayload,
    });

    logger.info(`User ${userId} updated successfully`);
    const { password: _, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  } catch (err) {
    logger.error(`Failed to update user ${userId}: ${err}`);
    throw err;
  }
};
