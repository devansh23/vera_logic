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
  return new PrismaClient({
    log: ['error', 'warn'],
  })
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