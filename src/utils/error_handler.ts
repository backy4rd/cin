import * as _ from 'lodash';
import { promises as fsp } from 'fs';
import { Request, Response, NextFunction } from 'express';
import { AssertionError } from 'chai';
import { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';
import ModelError from './model_error';
import logger from '../providers/logger';

export async function clientErrorHandler(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction,
) {
    if (req.files) {
        await Promise.all(_.values(req.files).map((file) => fsp.unlink(file.path)));
    }

    if (err instanceof AssertionError) {
        const [status, message] = err.message.split(':');
        return res.status(parseInt(status)).json({
            error: { message: message },
        });
    }

    if (err instanceof ModelError) {
        return res.status(400).json({
            error: { message: err.message },
        });
    }

    if (err instanceof TokenExpiredError) {
        return res.status(401).json({
            error: { message: 'Token expired' },
        });
    }

    if (err instanceof JsonWebTokenError) {
        return res.status(401).json({
            error: { message: 'Invalid token' },
        });
    }

    next(err);
}

export function serverErrorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
    logger.error(err);

    if (res.writableEnded) return;

    return res.status(500).json({
        error: { message: 'Internal server error' },
    });
}
