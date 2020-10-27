import * as http from 'http';

import env from './providers/env';
import app from './providers/express';
import socket from './providers/socket';

let server: http.Server;

export function init() {
  server = http.createServer(app);
  socket.init(server);
}

export function listen() {
  socket.listen();
  server.listen(env.PORT, () => {
    console.log('server listening on port ' + env.PORT);
  });
}

export default server;
