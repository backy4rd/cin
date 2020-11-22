import * as os from 'os';
import * as cluster from 'cluster';

import * as server from './server';

if (cluster.isMaster) {
    const cpus = os.cpus();
    cpus.forEach(() => cluster.fork());
} else {
    server.init();
    server.listen();
}
