import * as knex from 'knex';
import * as users_data from '../seed_data/users.json';

export function seed(knex: knex<any>) {
  return knex('users')
    .del()
    .then(function () {
      return knex('users').insert(users_data);
    });
}
