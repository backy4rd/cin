import * as fs from 'fs';
import * as _ from 'lodash';
import * as formidable from 'formidable';
import { Request, Response, NextFunction } from 'express';

import asyncHander from '../decorators/async_handler';

const formOption: any = {
    maxFileSize: 5 * 1024 ** 3, // 5 GB,
    multiple: false,
};

class UploadMiddleware {
    @asyncHander
    public async storeVideoAndPoster(req: Request, res: Response, next: NextFunction) {
        const form = new formidable.IncomingForm(formOption);

        const { fields, files } = await new Promise((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
                if (err) reject(err);

                resolve({ fields, files });
            });
        });

        req.body = fields;
        req.files = files;

        next();
    }

    @asyncHander
    public async removeTempVideoAndPoster(req: Request, res: Response, next: NextFunction) {
        const files = req.files;

        for (const field in files) {
            await fs.promises.unlink(files[field].path);
        }

        next();
    }
}

export default new UploadMiddleware();
