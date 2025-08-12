import { PrismaClient } from '@prisma/client'

// Prevent multiple instances of Prisma Client in development
declare global {
  var prisma: PrismaClient | undefined;
}

/**
 * PrismaClient is attached to the `global` object in development to prevent
 * exhausting the database connection limit due to hot module reloading.
 * 
 * This approach helps address the "Too many clients" error by ensuring
 * we're reusing connections rather than creating new ones on each reload.
 */

// Configure Prisma client with connection pooling settings
const prismaClientSingleton = () => {
  const client = new PrismaClient({
    log: [
      { level: 'query', emit: 'event' },
      { level: 'error', emit: 'stdout' },
      { level: 'warn', emit: 'stdout' },
      { level: 'info', emit: 'stdout' },
    ],
    errorFormat: 'pretty'
  });
  
  // Add detailed query logging ONLY in development environment
  if (process.env.NODE_ENV === 'development') {
    client.$on('query', (e: any) => {
      console.log('Prisma Query:', e.query);
      // Only log params in development and avoid logging sensitive data
      const sanitizedParams = e.params ? '[PARAMS_HIDDEN_FOR_SECURITY]' : '[]';
      console.log('Prisma Params:', process.env.NODE_ENV === 'development' ? e.params : sanitizedParams);
      console.log('Prisma Duration:', `${e.duration}ms`);
    });
  }
  
  return client;
}

export const prisma = global.prisma || prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
} 