import { promises as fsp } from 'fs';
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
    public async storeUploadFiles(req: Request, res: Response, next: NextFunction) {
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
    public async removeTempUploadFiles(req: Request, res: Response, next: NextFunction) {
        await Promise.all(_.values(req.files).map((file) => fsp.unlink(file.path)));

        next();
    }
}

export default new UploadMiddleware();
