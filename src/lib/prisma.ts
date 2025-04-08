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
  
  // Add detailed query logging in development environment
  if (process.env.NODE_ENV !== 'production') {
    client.$on('query', (e) => {
      console.log('Prisma Query:', e.query);
      console.log('Prisma Params:', e.params);
      console.log('Prisma Duration:', `${e.duration}ms`);
    });
  }
  
  // Add error handling
  client.$use(async (params, next) => {
    try {
      return await next(params);
    } catch (error) {
      console.error(`Prisma Error in ${params.model}.${params.action}:`, error);
      throw error;
    }
  });
  
  return client;
}

export const prisma = global.prisma || prismaClientSingleton()

// Disconnect from the database on exit in non-production environments
// This helps free up connections when the server is shut down
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma
  
  // Handle application shutdown to properly close connections
  process.on('beforeExit', async () => {
    await global.prisma?.$disconnect()
  })
} 