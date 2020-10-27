import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export default {
  PORT: parseInt(process.env.PORT) || 8080,
  DB_PORT: parseInt(process.env.DB_PORT) || 3306,
  DB_HOST: process.env.DB_HOST || '127.0.0.1',
  DB_USER: process.env.DB_USER || 'root',
  DB_PASSWORD: process.env.DB_PASSWORD || null,
  DB_NAME: process.env.DB_NAME || 'test',
  DB_MIN_POOL_SIZE: parseInt(process.env.DB_MIN_POOL_SIZE) || 0,
  DB_MAX_POOL_SIZE: parseInt(process.env.DB_MAX_POOL_SIZE) || 10,
};
