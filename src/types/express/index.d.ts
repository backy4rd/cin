declare module Express {
    export interface Local {
        auth?: import('../../interfaces/user').UserToken;
    }

    export interface Request {
        local: Local;
    }
}
