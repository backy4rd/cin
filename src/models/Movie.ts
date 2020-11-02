import knex from '../providers/database';

export interface IMovie {
  name: string;
  duration: number;
  created_at?: Date;
  updated_at?: Date;
}

export default knex<IMovie>('movies');
