import db from '../providers/database';

import { IMovie } from '../interfaces/IMovie';

import ModelError from '../utils/model_error';

export const tableName = 'movies';

class Movie {
  public async create(movie: IMovie) {
    if (!movie.name) {
      throw new ModelError('Name is Required');
    }
    if (!movie.duration) {
      throw new ModelError('Duration is Required');
    }

    try {
      await db(tableName).insert(movie);
    } catch (err) {
      throw new ModelError(err.message);
    }
  }
}

export default new Movie();
