import prisma from '../prismaClient';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import AppError from '../utils/AppError';
import logger from '../utils/logger';
import { User } from '@prisma/client'; 

export const createUser = async (name: string, phone: string, password: string): Promise<{ user: User; token: string }> => {
  logger.debug(`Attempting to create user: ${phone}`);
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      name,
      phone,
      password: hashedPassword,
      role: 'USER', 
    },
  });

  const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET!, {
    expiresIn: '1h',
  });

  logger.info(`User ${user.id} created successfully.`);
  return { user, token };
};

export const login = async (phone: string, password: string): Promise<{ user: User; token: string }> => {
  logger.debug(`Attempting to log in user with phone: ${phone}`);

  const user = await prisma.user.findUnique({
    where: { phone },
  });

  if (!user) {
    logger.warn(`Login failed: User with phone ${phone} not found.`);
    throw new AppError('User not found', 404); 
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    logger.warn(`Login failed for user ${phone}: Invalid credentials.`);
    throw new AppError('Invalid credentials', 401); 
  }

  const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET!, {
    expiresIn: '1h',
  });

  logger.info(`User ${user.id} logged in successfully.`);
  return { user, token };
};

