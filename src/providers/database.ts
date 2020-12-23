import * as knex from 'knex';
import knexConfig from '../config/knexfile';
import env from './env';

const connection = knex(knexConfig[env.NODE_ENV]);

export default connection;
