import * as path from 'path';
import * as knex from 'knex';

import env from '../providers/env';

const config = {
  development: {
    client: 'mysql2',
    connection: {
      port: env.DB_PORT,
      host: env.DB_HOST,
      user: env.DB_USER,
      password: env.DB_PASSWORD,
      database: env.DB_NAME,
    },
    useNullAsDefault: true,
    migrations: {
      tableName: 'knex-migrations',
      directory: path.join(__dirname, '../db/migrations'),
    },
    seeds: {
      directory: path.join(__dirname, '../db/seeds'),
    },
    pool: {
      min: env.DB_MIN_POOL_SIZE,
      max: env.DB_MAX_POOL_SIZE,
    },
  },
} as knex.Config;

export default config;
