import * as knex from 'knex';
import env from './env';

const connection = knex({
  client: 'mysql2',
  connection: {
    host: env.DB_HOST,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
    port: env.DB_PORT,
  },
  pool: {
    min: env.DB_MIN_POOL_SIZE,
    max: env.DB_MAX_POOL_SIZE,
  },
});

export default connection;
