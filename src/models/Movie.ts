import * as _ from 'lodash';
import knex from '../providers/database';
import ModelError from '../utils/model_error';

const vietnameseRegex = /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s]+$/;
const pathRegex = /^[\w\/\.]+$/;

export interface IMovie {
  movie_id?: number;
  hls_path?: string;
  duration?: number;
  title?: string;
  poster_path?: string;
  description?: string;
  uploaded_by?: number;
  created_at?: Date;
  updated_at?: Date;
}

export const tableName = 'movies';
export const knexMovie = knex<IMovie>(tableName);

class Movie {
  public validateMovie(movie: IMovie) {
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

  public async create(movie: IMovie) {
    this.validateMovie(movie);

    try {
      return await knexMovie.insert(movie);
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

  public async update(movie_id: number, movie: IMovie) {
    this.validateMovie(movie);

    try {
      movie.updated_at = new Date();
      const filteredMovie = _.pickBy(movie, _.identity); // remove all falsy property
      return await knexMovie.update(filteredMovie).where('movie_id', movie_id);
    } catch (err) {
      throw err;
    }
  }

  public async delete(movie_id: number) {
    try {
      return await knexMovie.where('movie_id', movie_id).del();
    } catch (err) {
      throw err;
    }
  }
}

export default new Movie();
