import * as knex from 'knex';
import * as roles_data from '../seed_data/roles.json';

export function seed(knex: knex<any>) {
  return knex('roles')
    .del()
    .then(function () {
      return knex('roles').insert(roles_data);
    });
}
