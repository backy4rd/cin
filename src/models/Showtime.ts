import * as _ from 'lodash';
import knex from '../providers/database';
// import ModelError from '../utils/model_error';

import { IShowtime, IQueryShowtime } from '../interfaces/showtime';

export const tableName = 'showtimes';
export const knexShowtime = knex<IShowtime>(tableName);

class Showtime {
  public async create(showtime: IShowtime): Promise<void> {
    try {
      await knexShowtime.insert(showtime);
    } catch (err) {
      throw err;
    }
  }

  public async update(
    showtime_id: number,
    showtime: IShowtime,
  ): Promise<number> {
    try {
      const filteredMovie = _.pickBy(showtime, _.identity); // remove all falsy property
      return await knexShowtime
        .update(filteredMovie)
        .where('showtime_id', showtime_id);
      //
    } catch (err) {
      throw err;
    }
  }

  public async delete(showtime_id: number): Promise<number> {
    try {
      return await knexShowtime.where('showtime_id', showtime_id).del();
    } catch (err) {
      throw err;
    }
  }

  public async getShowtimesByMovieId(
    movie_id: number,
  ): Promise<IQueryShowtime> {
    try {
      const showtimes = await knexShowtime
        .select('showtime_id', 'start_time', 'movie_id')
        .join('movies', 'movies.movie_id', 'showtimes.movie_id')
        .where('movie_id', movie_id);

      return showtimes.length === 0 ? null : showtimes[0];
      //
    } catch (err) {
      throw err;
    }
  }
}

export default new Showtime();
