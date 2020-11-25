import { Request, Response, NextFunction } from 'express';

import asyncHander from '../decorators/async_handler';

class IdentifyMiddleware {
    @asyncHander
    public async isManager(req: Request, res: Response, next: NextFunction) {}
}

export default new IdentifyMiddleware();
