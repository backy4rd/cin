export interface IUser {
  user_id?: number;
  username?: string;
  password?: string;
  role_id?: number;
}

export interface IQueryUser {
  user_id: number;
  username: string;
  password: string;
  role: string;
}

export interface UserToken {
  username: string;
  role: string;
  iat?: number;
  exp?: number;
}
