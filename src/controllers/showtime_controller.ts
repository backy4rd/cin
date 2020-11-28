import { Request, Response } from 'express';
import { expect } from 'chai';

import Showtime from '../models/Showtime';
import Movie from '../models/Movie';

import asyncHander from '../decorators/async_handler';

class ShowtimeController {
    @asyncHander
    public async getShowtimesByMovieId(req: Request, res: Response) {
        const movie_id = parseInt(req.params.movie_id);

        const movie = await Movie.getMovieById(movie_id);
        expect(movie, "404:movie_id doesn't exist").to.exist;

        const showtimes = await Showtime.getShowtimesByMovieId(movie_id);

        res.status(200).json({
            data: showtimes,
        });
    }

    @asyncHander
    public async createShowtime(req: Request, res: Response) {}

    @asyncHander
    public async deleteShowtime(req: Request, res: Response) {
        const showtime_id = parseInt(req.params.showtime_id);

        const rowEffect = await Showtime.delete(showtime_id);
        expect(rowEffect, '404:Showtime not found').to.not.equal(0);

        res.status(200).json({
            data: { message: 'Delete success' },
        });
    }

    @asyncHander
    public async updateShowtime(req: Request, res: Response) {}
}

export default new ShowtimeController();
