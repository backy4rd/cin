declare module Express {
  export interface Local {}

  export interface Request {
    local: Local;
  }
}
