import prisma from '../prismaClient';
import logger from '../utils/logger';
import bcrypt from 'bcrypt';

export const createUser = async (name: string, phone: string, password: string) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    return prisma.user.create({
        data: { name, phone, password: hashedPassword },
    });
};


export const getUserPrompts = async (userId: number) => {
    logger.debug(`Fetching prompts for user ${userId}`);
    return prisma.prompt.findMany({
        where: { userId },
        include: { category: true, subCategory: true },
    });
};

export const updateSelf = async (userId: number, data: { name?: string; phone?: string; password?: string }) => {
    logger.debug(`Updating user ${userId} profile`);
    if (data.password) {
        data.password = await bcrypt.hash(data.password, 10);
    }
    return prisma.user.update({
        where: { id: userId },
        data,
    });
};
