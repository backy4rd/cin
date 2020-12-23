import * as express from 'express';
import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';
import * as url from 'url';

import Showtime from '../models/Showtime';

const staticDir = path.resolve(__dirname, '../../data');

const router = express.Router();

router.get('/*/*.m3u8', async (req: express.Request, res: express.Response) => {
    if (!req.query.showtime_id) {
        return res.status(400).send('missing parameter');
    }

    const showtime_id = parseInt(req.query.showtime_id as string);
    if (isNaN(showtime_id)) {
        return res.status(400).send('invalid parameter');
    }

    const showtime = await Showtime.getShowtimeById(showtime_id);
    if (!showtime) {
        return res.status(404).send('showtime not found');
    }

    const start_time: number = ~~(showtime.start_time.getTime() / 1000);
    const now: number = ~~(Date.now() / 1000);

    if (now - start_time < 0) {
        return res.status(200).send('stream not start yet');
    }
    if (now - (start_time + showtime.duration) > 0) {
        return res.status(200).send('stream ended');
    }

    //
    const m3u8Path = path.resolve(staticDir, url.parse(req.url).pathname.slice(1));

    const rl = readline.createInterface({
        input: fs.createReadStream(m3u8Path),
        crlfDelay: Infinity,
    });

    let i = 0;
    for await (const line of rl) {
        if (i == 3) {
            res.write(`#EXT-X-START:TIME-OFFSET=${now - start_time}\n`);
        }

        res.write(line + '\n');
        i++;
    }

    res.status(200).end();
});

router.use(express.static(staticDir));

export default router;
