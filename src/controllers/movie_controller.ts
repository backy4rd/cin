import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import * as jimp from 'jimp';
import getVideoDuration from 'get-video-duration';
import { expect } from 'chai';
import { Request, Response, NextFunction } from 'express';

import Movie from '../models/Movie';

import asyncHander from '../decorators/async_handler';
import { mustExist } from '../decorators/validate_decorators';
import processVideo from '../utils/process_video';

const staticDir = path.resolve(__dirname, '../../data');

class MovieController {
    @asyncHander
    public async getMovieById(req: Request, res: Response) {}

    @asyncHander
    public async getMovies(req: Request, res: Response) {}

    @asyncHander
    public async getUpcommingMovies(req: Request, res: Response) {}

    @asyncHander
    public async getShowingMovies(req: Request, res: Response) {}

    @asyncHander
    public async updateMovie(req: Request, res: Response) {}

    @asyncHander
    public async deleteMovie(req: Request, res: Response) {}

    @asyncHander
    @mustExist('files.movie', 'files.poster', 'body.title')
    public async validatePostMovieRequest(req: Request, res: Response, next: NextFunction) {
        const { movie, poster } = req.files;

        expect(movie.type, '400:Invalid filetype').to.match(/video/);
        expect(poster.type, '400:Invalid filetype').to.match(/image/);

        res.status(200).json({
            data: { message: 'Upload success' },
        });

        next();
    }

    @asyncHander
    public async makeHlsFiles(req: Request, res: Response, next: NextFunction) {
        const { movie, poster } = req.files;

        const outDirName = crypto.randomBytes(16).toString('hex');
        const outDirPath = path.resolve(staticDir, outDirName);
        const image = await jimp.read(poster.path);

        await fs.promises.mkdir(outDirPath);

        await image.writeAsync(path.resolve(outDirPath, 'poster.jpg'));

        await processVideo(movie.path, outDirPath);

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
