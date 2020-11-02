import knex from '../providers/database';

export async function up() {
  if (await knex.schema.hasTable('movies')) {
    return;
  }
  return knex.schema.createTable('movies', function (table) {
    table.string('name').notNullable().primary();
    table.integer('duration').notNullable();
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
  });
}

export async function down() {
  return knex.schema.dropTableIfExists('movies');
}
