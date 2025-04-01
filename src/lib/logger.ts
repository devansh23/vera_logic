/**
 * Simple logger utility
 */
export function log(message: string, data?: any): void {
  console.log(`[${new Date().toISOString()}] ${message}`, data || '');
} 