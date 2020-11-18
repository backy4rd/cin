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

export interface IQueryMovieDetail {
  movie_id: number;
  hls_path: string;
  duration: number;
  title: string;
  poster_path: string;
  description: string;
  uploaded_by: string;
  created_at: Date;
  updated_at: Date;
}

export interface IQueryShowingMovie {
  movie_id: number;
  hls_path: string;
  duration: number;
  title: string;
  poster_path: string;
}

export interface IQueryUpcommingMovie {
  movie_id: number;
  hls_path: string;
  duration: number;
  title: string;
  poster_path: string;
  earliest_start_time: Date;
}

export interface Range {
  offset: number;
  limit: number;
}
