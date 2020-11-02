import knex from '../providers/database';

export interface IMovie {
  id: number;
  start_time: Date;
  movie: string;
  created_at?: Date;
  updated_at?: Date;
}

export default knex<IMovie>('schedules');
