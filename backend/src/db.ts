import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function dbQuery(query: string, params?: any): Promise<any> {
  try {
    const result = await prisma.$queryRaw(query, params);
    return result;
  } catch (error) {
    console.error('Database query error:', error);
    throw new Error('Failed to execute database query.');
  }
}

export default prisma;