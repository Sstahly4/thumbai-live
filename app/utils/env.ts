import dotenv from 'dotenv';
import path from 'path';

export function loadEnvVars() {
  if (process.env.NODE_ENV === 'development') {
    dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
  }
  dotenv.config({ path: path.resolve(process.cwd(), '.env') });
} 