import { expect } from 'chai';
import { Request, Response, NextFunction } from 'express';

import User from '../models/User';
import asyncHander from '../decorators/async_handler';
import { isString, mustExist } from '../decorators/validate_decorators';

const jwtRegex = /^[A-Za-z]+ [A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/;

class AuthController {
    @asyncHander
    @mustExist('body.username', 'body.password')
    @isString('body.username', 'body.password')
    public async login(req: Request, res: Response) {
        const { username, password } = req.body;

        const user = await User.getUserByUsername(username);
        expect(user, '404:Username not found').to.exist;

        const isMatch = await User.comparePassword(password, user.password);
        expect(isMatch, "400:Password don't match").to.be.true;

        const jwt = await User.signJWT(user);

        return res.status(200).json({
            data: { token: jwt },
        });
    }

    @asyncHander
    public async authorize(req: Request, res: Response, next: NextFunction) {
        const authorization: string = req.headers.authorization;

        expect(authorization, '401:Missing token').to.exist;
        expect(authorization, '401:Invalid token format').to.match(jwtRegex);

        // prettier-ignore
        const [/* type */, token] = authorization.split(' ');
        const jwt = await User.verifyJWT(token);

        req.local.auth = jwt;
        next();
    }

    @asyncHander
    @mustExist('body.old_password', 'body.new_password')
    @isString('body.old_password', 'body.new_password')
    public async changePassword(req: Request, res: Response) {
        const { old_password, new_password } = req.body;

        const username = req.local.auth.username;
        const user = await User.getUserByUsername(username);

        const isMatch = await User.comparePassword(old_password, user.password);
        expect(isMatch, "400:Password don't match").to.be.true;

        await User.update(username, { password: new_password });

        return res.status(200).json({
            data: { message: 'Change password success' },
        });
    }
}

export default new AuthController();
