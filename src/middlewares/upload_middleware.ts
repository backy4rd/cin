import { Request, Response, NextFunction } from 'express';

import asyncHander from '../decorators/async_handler';

class UploadMiddleware {
    @asyncHander
    public async storeVideoAndPoster(req: Request, res: Response, next: NextFunction) {}

    @asyncHander
    public async removeTempVideoAndPoster(req: Request, res: Response, next: NextFunction) {}
}

export default new UploadMiddleware();
