import { PrismaClient } from '@prisma/client';

const logConfig = process.env.NODE_ENV === 'development' 
    ? ['warn', 'error', 'query'] 
    : ['warn', 'error'];

const prisma = new PrismaClient({
    log: logConfig,
});

export default prisma;