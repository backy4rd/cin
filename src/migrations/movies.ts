import knex from '../providers/database';

export function up() {
  return knex.schema.createTable('movies', function (table) {
    table.string('name').notNullable().primary();
    table.integer('duration').notNullable();
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
  });
}

export function down() {
  return knex.schema.dropTable('movies');
}
