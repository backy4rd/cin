export interface IShowtime {
  showtime_id?: number;
  start_time?: Date;
  movie_id?: number;
}

export interface IQueryShowtime {
  showtime_id: number;
  start_time: Date;
  movie_id: number;
}
