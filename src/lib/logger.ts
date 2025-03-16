import fs from 'fs';
import path from 'path';

const logFile = path.join(process.cwd(), 'app.log');

export function log(message: string, data?: any) {
  const timestamp = new Date().toISOString();
  const logMessage = `${timestamp} - ${message}${data ? ' - ' + JSON.stringify(data) : ''}\n`;
  
  fs.appendFileSync(logFile, logMessage);
} 