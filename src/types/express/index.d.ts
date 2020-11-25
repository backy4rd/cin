declare module Express {
    interface Local {
        auth?: import('../../interfaces/user').UserToken;
    }

    interface Request {
        local: Local;
        files: import('formidable').Files;
    }
}
