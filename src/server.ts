import * as http from 'http';

import env from './providers/env';
import app from './providers/express';

class Server {
    public server: http.Server;

    public init() {
        this.server = http.createServer(app);
    }

    public listen() {
        this.server.listen(env.PORT, () => {
            console.log('server listening on port ' + env.PORT);
        });
    }
}

export default new Server();
