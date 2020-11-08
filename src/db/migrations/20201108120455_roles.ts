import * as knex from 'knex';

export function up(knex: knex<any>) {
  return knex.schema.createTable('roles', (table: knex.TableBuilder) => {
    table.increments('role_id');
    table.string('role').notNullable();
  });
}

export function down(knex: knex<any>) {
  return knex.schema.dropTable('roles');
}

