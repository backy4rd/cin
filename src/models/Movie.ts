import * as _ from 'lodash';
import knex from '../providers/database';
import ModelError from '../utils/model_error';

import { IMovie, IQueryMovie, Range } from '../interfaces/movie';

const vietnameseRegex = /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s]+$/;
const pathRegex = /^[\w\/\.]+$/;

export const tableName = 'movies';
export const knexMovie = knex<IMovie>(tableName);

class Movie {
  public validateMovie(movie: IMovie): void {
    if (movie.title && !vietnameseRegex.test(movie.title)) {
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
      await knexMovie.insert(movie);
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        throw new ModelError('hls_path conflict');
      }
      if (err.code === 'ER_NO_REFERENCED_ROW_2') {
        throw new ModelError('uploaded_by not exist');
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
      return await knexMovie.update(filteredMovie).where('movie_id', movie_id);
    } catch (err) {
      throw err;
    }
  }

  public async delete(movie_id: number): Promise<number> {
    try {
      return await knexMovie.where('movie_id', movie_id).del();
    } catch (err) {
      throw err;
    }
  }

  public async getMovies(
    range: Range = { offset: 0, limit: 30 },
  ): Promise<IQueryMovie[]> {
    try {
      return await knexMovie
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
        .orderBy('created_at')
        .offset(range.offset)
        .limit(range.limit);
    } catch (err) {
      throw err;
    }
  }

  public async getMovieById(movie_id: number): Promise<IQueryMovie> {
    try {
      const [movie] = await knexMovie
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

      return movie;
      //
    } catch (err) {
      throw err;
    }
  }
}

export default new Movie();
