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

export interface IQueryMovie {
  movie_id?: number;
  hls_path?: string;
  duration?: number;
  title?: string;
  poster_path?: string;
  description?: string;
  uploaded_by?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface Range {
  offset: number;
  limit: number;
}
