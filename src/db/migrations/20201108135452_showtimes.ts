import * as knex from 'knex';

export function up(knex: knex<any>) {
  return knex.schema.createTable('showtimes', (table: knex.TableBuilder) => {
    table.increments('showtime_id');
    table.dateTime('start_time', { useTz: true }).notNullable();
    table.integer('movie_id').unsigned().notNullable();

    table.foreign('movie_id').references('movie_id').inTable('movies');
    table.index('start_time');
  });
}

export function down(knex: knex<any>) {
  return knex.schema.dropTable('showtimes');
}
