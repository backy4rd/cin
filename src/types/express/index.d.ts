declare module Express {
    interface Local {
        auth?: import('../../interfaces/user').UserToken;
        outDir?: string;
    }

    interface Request {
        local: Local;
        files: import('formidable').Files;
    }
}
