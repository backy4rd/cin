import * as _ from 'lodash';
import knex from '../providers/database';
import ModelError from '../utils/model_error';

import { IShowtime, IQueryShowtime, IQueryShowtimeDetail } from '../interfaces/showtime';
import { Range } from '../interfaces/general';

export const tableName = 'showtimes';

class Showtime {
    public async create(showtime: IShowtime): Promise<void> {
        try {
            await knex(tableName).insert(showtime);
        } catch (err) {
            if (err.code === 'ER_NO_REFERENCED_ROW_2') {
                throw new ModelError("movie_id doesn't exist");
            }
            throw err;
        }
    }

    public async update(showtime_id: number, showtime: IShowtime): Promise<number> {
        try {
            const filteredMovie = _.pickBy(showtime, _.identity); // remove all falsy property
            return await knex(tableName).update(filteredMovie).where('showtime_id', showtime_id);
            //
        } catch (err) {
            throw err;
        }
    }

    public async delete(showtime_id: number): Promise<number> {
        try {
            return await knex(tableName).where('showtime_id', showtime_id).del();
        } catch (err) {
            throw err;
        }
    }

    public async getShowtimesByMovieId(movie_id: number): Promise<IQueryShowtime[]> {
        try {
            return await knex(tableName)
                .select('showtime_id', 'start_time', 'movies.movie_id')
                .join('movies', 'movies.movie_id', 'showtimes.movie_id')
                .where('movies.movie_id', movie_id);

            //
        } catch (err) {
            throw err;
        }
    }

    public async getShowtimeById(showtime_id: number): Promise<IQueryShowtimeDetail> {
        try {
            const showtimes = await knex(tableName)
                .select('showtime_id', 'start_time', 'movies.movie_id', 'duration')
                .join('movies', 'movies.movie_id', 'showtimes.movie_id')
                .where('showtime_id', showtime_id);

            return showtimes.length === 0 ? null : showtimes[0];
            //
        } catch (err) {
            throw err;
        }
    }

    public async getPlayingShowtimesByMovieId(
        movie_id: number,
        range: Range = { offset: 0, limit: 30 },
    ): Promise<IQueryShowtime[]> {
        try {
            return await knex(tableName)
                .select('showtimes.*')
                .join('movies', 'movies.movie_id', 'showtimes.movie_id')
                .where('showtimes.movie_id', '=', movie_id)
                .andWhere(
                    knex.raw('DATE_ADD(start_time, INTERVAL duration SECOND)'),
                    '>',
                    knex.fn.now(),
                )
                .andWhere('start_time', '<=', knex.fn.now())
                .offset(range.offset)
                .limit(range.limit);

            //
        } catch (err) {
            throw err;
        }
    }
}

export default new Showtime();
