import * as knex from 'knex';

export function up(knex: knex<any>) {
  return knex.schema.createTable('users', (table: knex.TableBuilder) => {
    table.increments('user_id');
    table.string('username').unique().notNullable();
    table.string('password').notNullable();
    table.integer('role_id').unsigned().notNullable();

    table.foreign('role_id').references('role_id').inTable('roles');
  });
}

export function down(knex: knex<any>) {
  return knex.schema.dropTable('users');
}
