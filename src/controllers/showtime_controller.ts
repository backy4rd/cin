import { Request, Response } from 'express';
import { expect } from 'chai';

import Showtime from '../models/Showtime';
import Movie from '../models/Movie';

import {
    isDateFormat,
    isNumber,
    mustExist,
    mustExistOne,
    parseDate,
} from '../decorators/validate_decorators';
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
    @mustExist('body.movie_id', 'body.start_time')
    @isNumber('body.movie_id')
    @isDateFormat('body.start_time')
    @parseDate('body.start_time')
    public async createShowtime(req: Request, res: Response) {
        const { movie_id, start_time } = req.body;

        await Showtime.create({
            movie_id: movie_id,
            start_time: start_time,
        });

        res.status(201).json({
            data: { message: 'Create success' },
        });
    }

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
    @mustExistOne('body.start_time')
    @isDateFormat('body.start_time')
    @parseDate('body.start_time')
    public async updateShowtime(req: Request, res: Response) {
        const showtime_id = parseInt(req.params.showtime_id);
        const { start_time } = req.body;

        const rowEffect = await Showtime.update(showtime_id, {
            start_time: start_time,
        });
        expect(rowEffect, '404:Showtime not found').to.not.equal(0);

        res.status(200).json({
            data: { message: 'Update success' },
        });
    }
}

export default new ShowtimeController();
