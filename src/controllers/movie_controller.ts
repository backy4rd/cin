import { expect } from 'chai';
import { Request, Response, NextFunction } from 'express';

import asyncHander from '../decorators/async_handler';
import { mustExist } from '../decorators/validate_decorators';

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

        next();
    }

    @asyncHander
    public async makeHlsFiles(req: Request, res: Response, next: NextFunction) {}

    @asyncHander
    public async createMovieRecord(req: Request, res: Response) {}
}

export default new MovieController();
