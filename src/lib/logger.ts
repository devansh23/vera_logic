/**
 * Simple logger utility
 */
export function log(message: string, data?: unknown): void {
  console.log(`[${new Date().toISOString()}] ${message}`, data || '');
} 