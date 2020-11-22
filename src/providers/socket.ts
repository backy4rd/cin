import * as http from 'http';
import * as socketIO from 'socket.io';

export class Socket {
    public io: socketIO.Server;

    public init(server: http.Server): void {
        this.io = socketIO(server);
    }

    public listen(): void {}
}

export default new Socket();
