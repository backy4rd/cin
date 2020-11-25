import { expect } from 'chai';
import { Request, Response, NextFunction } from 'express';

import asyncHander from '../decorators/async_handler';

import roleModel from '../models/Role';

class IdentifyMiddleware {
    @asyncHander
    public async isManager(req: Request, res: Response, next: NextFunction) {
        expect(req.local.auth.role, '403:Permission denined').to.be.oneOf([roleModel.ADMIN]);

        next();
    }
}

export default new IdentifyMiddleware();
