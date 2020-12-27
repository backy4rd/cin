import { promises as fsp } from 'fs';
import * as path from 'path';
import * as sharp from 'sharp';
import { expect } from 'chai';
import { Request, Response, NextFunction } from 'express';

import Movie from '../models/Movie';
import Showtime from '../models/Showtime';

import asyncHander from '../decorators/async_handler';
import { mustExist } from '../decorators/validate_decorators';
import processVideoInOrder from '../utils/process_video';
import getVideoDuration from '../utils/get_video_duration';
import makeMovieName from '../utils/make_movie_name';

const staticDir = path.resolve(__dirname, '../../data');

class MovieController {
    @asyncHander
    public async getMovieById(req: Request, res: Response) {
        const movie_id = parseInt(req.params.movie_id);

        const movie = await Movie.getMovieById(movie_id);
        expect(movie, '404:Movie not found').to.not.be.null;

        res.status(200).json({
            data: movie,
        });
    }

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
    public async getMovies(req: Request, res: Response) {
        const limit = parseInt(req.query.limit as string) || 30;
        const offset = parseInt(req.query.offset as string) || 0;

        const movies = await Movie.getMovies({ offset, limit });

        res.status(200).json({
            data: movies,
        });
    }

    @asyncHander
    public async getUpcommingMovies(req: Request, res: Response) {
        const limit = parseInt(req.query.limit as string) || 30;
        const offset = parseInt(req.query.offset as string) || 0;
        const day_offset = parseInt(req.query.day_offset as string) || 7;

        const movies = await Movie.getUpcommingMovies(day_offset, { offset, limit });

        res.status(200).json({
            data: movies,
        });
    }

    @asyncHander
    public async getShowingMovies(req: Request, res: Response) {
        const limit = parseInt(req.query.limit as string) || 30;
        const offset = parseInt(req.query.offset as string) || 0;

        const movies = await Movie.getShowingMovies({ offset, limit });

        res.status(200).json({
            data: movies,
        });
    }

    @asyncHander
    public async updateMovie(req: Request, res: Response, next: NextFunction) {
        const movie_id = parseInt(req.params.movie_id);
        const { poster } = req.files;

        const movie = await Movie.getMovieById(movie_id);
        expect(movie, '404:Movie not found').to.not.be.null;

        if (poster) {
            // Replace old poster
            await sharp(poster.path).jpeg().toFile(path.resolve(staticDir, movie.poster_path));
        }

        await Movie.update(movie_id, {
            title: req.body.title,
            description: req.body.description,
        });

        res.status(200).json({
            data: { message: 'Update success' },
        });

        next();
    }

    @asyncHander
    public async deleteMovie(req: Request, res: Response) {
        const movie_id = parseInt(req.params.movie_id);

        const movie = await Movie.getMovieById(movie_id);
        expect(movie, '404:Movie not found').to.not.be.null;

        await Movie.delete(movie_id);

        const movieDirPath = path.resolve(
            staticDir,
            movie.hls_path.slice(0, movie.hls_path.indexOf('/')),
        );

        await fsp.rmdir(movieDirPath, { recursive: true });

        res.status(200).json({
            data: { message: 'Delete success' },
        });
    }

    @asyncHander
    @mustExist('files.movie', 'files.poster', 'body.title')
    public async validatePostMovieRequestAndSendResponse(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        const { movie, poster } = req.files;

        expect(movie.type, '400:Invalid filetype').to.match(/video/);
        expect(poster.type, '400:Invalid filetype').to.match(/image/);

        Movie.validateMovie({ title: req.body.title });

        res.status(202).json({
            data: { message: 'Upload success' },
        });

        next();
    }

    @asyncHander
    public async makeHlsFiles(req: Request, res: Response, next: NextFunction) {
        const { movie, poster } = req.files;

        const outDirName = makeMovieName(req.body.title);
        const outDirPath = path.resolve(staticDir, outDirName);

        await fsp.mkdir(outDirPath);

        await sharp(poster.path).jpeg().toFile(path.resolve(outDirPath, 'poster.jpg'));
        await processVideoInOrder(movie.path, outDirPath);

        req.local.outDir = outDirName;
        next();
    }

    @asyncHander
    public async createMovieRecord(req: Request, res: Response, next: NextFunction) {
        const { outDir } = req.local;

        await Movie.create({
            title: req.body.title,
            description: req.body.description,
            hls_path: outDir + '/seg.m3u8',
            poster_path: outDir + '/poster.jpg',
            duration: await getVideoDuration(req.files.movie.path),
            uploaded_by: req.local.auth.user_id,
        });

        next();
    }
}

export default new MovieController();
