import knex from '../providers/database';

export async function up() {
  if (await knex.schema.hasTable('schedules')) {
    return;
  }

  return knex.schema.createTable('schedules', function (table) {
    table.increments('id');
    table.timestamp('start_time').notNullable();
    table
      .string('movie')
      .notNullable()
      .references('name')
      .inTable('movies')
      .onDelete('CASCADE');
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
  });
}

export async function down() {
  return knex.schema.dropTableIfExists('schedules');
}
