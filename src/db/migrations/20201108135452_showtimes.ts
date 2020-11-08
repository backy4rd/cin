import * as knex from 'knex';

export function up(knex: knex<any>) {
  return knex.schema.createTable('showtimes', (table: knex.TableBuilder) => {
    table.increments('showtime_id');
    table.timestamp('start_time').notNullable();
    table.integer('movie_id').unsigned().notNullable();

    table.foreign('movie_id').references('movie_id').inTable('movies');
  });
}

export function down(knex: knex<any>) {
  return knex.schema.dropTable('showtimes');
}
