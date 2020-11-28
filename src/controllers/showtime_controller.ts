import { Request, Response } from 'express';

import asyncHander from '../decorators/async_handler';

class ShowtimeController {
    @asyncHander
    public async getShowtimesByMovieId(req: Request, res: Response) {}

    @asyncHander
    public async createShowtime(req: Request, res: Response) {}

    @asyncHander
    public async deleteShowtime(req: Request, res: Response) {}

    @asyncHander
    public async updateShowtime(req: Request, res: Response) {}
}

export default new ShowtimeController();
