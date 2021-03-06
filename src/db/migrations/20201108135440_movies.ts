import * as knex from 'knex';

export function up(knex: knex<any>) {
    return knex.schema.createTable('movies', (table: knex.TableBuilder) => {
        table.increments('movie_id');
        table.string('hls_path').unique().notNullable();
        table.integer('duration').notNullable();
        table.string('title').notNullable();
        table.string('poster_path').notNullable();
        table.string('description', 2048);
        table.integer('uploaded_by').unsigned().notNullable();
        table.timestamps(true, true);

        table.foreign('uploaded_by').references('user_id').inTable('users');
    });
}

export function down(knex: knex<any>) {
    return knex.schema.dropTable('movies');
}
