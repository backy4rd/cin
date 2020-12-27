import * as _ from 'lodash';
import knex from '../providers/database';
import ModelError from '../utils/model_error';

import {
    IMovie,
    IQueryUpcommingMovie,
    IQueryMovieDetail,
    IQueryShowingMovie,
} from '../interfaces/movie';
import { Range } from '../interfaces/general';

export const tableName = 'movies';

const containSpecialCharacterRegex = /[!@#$%^&*_+\-=\[\]{};"\\|,.<>\/?]/;
const pathRegex = /^[\w\/\.-]+$/;

class Movie {
    public validateMovie(movie: IMovie): void {
        if (movie.title && containSpecialCharacterRegex.test(movie.title)) {
            throw new ModelError('invalid title');
        }
        if (movie.description && !vietnameseRegex.test(movie.description)) {
            throw new ModelError('invalid description');
        }
        if (movie.hls_path && !pathRegex.test(movie.hls_path)) {
            throw new ModelError('invalid hls_path');
        }
        if (movie.poster_path && !pathRegex.test(movie.poster_path)) {
            throw new ModelError('invalid poster_path');
        }
    }

    public async create(movie: IMovie): Promise<void> {
        this.validateMovie(movie);

        try {
            await knex(tableName).insert(movie);
        } catch (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                throw new ModelError('hls_path conflict');
            }
            if (err.code === 'ER_NO_REFERENCED_ROW_2') {
                throw new ModelError("role_id doesn't exist");
            }
            // if (err.code === 'ER_NO_DEFAULT_FOR_FIELD') {
            //   throw new ModelError('missing required field');
            // }

            throw err;
        }
    }

    public async update(movie_id: number, movie: IMovie): Promise<number> {
        this.validateMovie(movie);

        try {
            movie.updated_at = new Date();
            const filteredMovie = _.pickBy(movie, _.identity); // remove all falsy property
            return await knex(tableName).update(filteredMovie).where('movie_id', movie_id);
        } catch (err) {
            throw err;
        }
    }

    public async delete(movie_id: number): Promise<number> {
        try {
            return await knex(tableName).where('movie_id', movie_id).del();
        } catch (err) {
            throw err;
        }
    }

    public async getMovies(range: Range = { offset: 0, limit: 30 }): Promise<IQueryMovieDetail[]> {
        try {
            return await knex(tableName)
                .select(
                    'movie_id',
                    'hls_path',
                    'duration',
                    'title',
                    'poster_path',
                    'description',
                    'username as uploaded_by',
                    'created_at',
                    'updated_at',
                )
                .join('users', 'users.user_id', 'movies.uploaded_by')
                .orderBy('created_at', 'desc')
                .offset(range.offset)
                .limit(range.limit);
        } catch (err) {
            throw err;
        }
    }

    public async getMovieById(movie_id: number): Promise<IQueryMovieDetail> {
        try {
            const movies = await knex(tableName)
                .select(
                    'movie_id',
                    'hls_path',
                    'duration',
                    'title',
                    'poster_path',
                    'description',
                    'username as uploaded_by',
                    'created_at',
                    'updated_at',
                )
                .join('users', 'users.user_id', 'movies.uploaded_by')
                .where('movie_id', movie_id);

            return movies.length === 0 ? null : movies[0];
            //
        } catch (err) {
            throw err;
        }
    }

    public async getShowingMovies(
        range: Range = { offset: 0, limit: 30 },
    ): Promise<IQueryShowingMovie[]> {
        try {
            return await knex(tableName)
                .select('movies.movie_id', 'title', 'duration', 'hls_path', 'poster_path')
                .join('showtimes', 'showtimes.movie_id', 'movies.movie_id')
                .where(
                    knex.raw('DATE_ADD(start_time, INTERVAL duration SECOND)'),
                    '>',
                    knex.fn.now(),
                )
                .andWhere('start_time', '<=', knex.fn.now())
                .groupBy('movies.movie_id')
                .orderBy('created_at', 'desc')
                .offset(range.offset)
                .limit(range.limit);

            //
        } catch (err) {
            throw err;
        }
    }

    public async getUpcommingMovies(
        dayOffset: number = 7,
        range: Range = { offset: 0, limit: 30 },
    ): Promise<IQueryUpcommingMovie[]> {
        try {
            return await knex(tableName)
                .select(
                    'movies.movie_id',
                    'title',
                    'duration',
                    'hls_path',
                    'poster_path',
                    knex.raw('MIN(start_time) AS earliest_start_time'),
                )
                .join('showtimes', 'showtimes.movie_id', 'movies.movie_id')
                .where(
                    knex.raw('DATE_ADD(start_time, INTERVAL ? DAY)', [dayOffset]),
                    '>',
                    knex.fn.now(),
                )
                .andWhere('start_time', '>', knex.fn.now())
                .groupBy('movies.movie_id')
                .orderBy('created_at', 'desc')
                .offset(range.offset)
                .limit(range.limit);

            //
        } catch (err) {
            throw err;
        }
    }
}

export default new Movie();
