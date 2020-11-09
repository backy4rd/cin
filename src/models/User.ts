import * as _ from 'lodash';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

import knex from '../providers/database';
import env from '../providers/env';

import { IUser, IQueryUser, UserToken } from '../interfaces/user';

export const tableName = 'users';
export const knexUser = knex<IUser>(tableName);

class User {
  public hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, env.SALT_ROUND);
  }

  public comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  public signJWT(user: IQueryUser): Promise<string> {
    const payload: UserToken = {
      username: user.username,
      role: user.role,
    };

    const option: jwt.SignOptions = {
      expiresIn: '1h',
    };

    return new Promise((resolve, reject) => {
      jwt.sign(payload, env.JWT_SECRET_KEY, option, (err, token) => {
        if (err) reject(err);
        resolve(token);
      });
    });
  }

  public verifyJWT(token: string): Promise<UserToken> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) reject(err);
        resolve(decoded as UserToken);
      });
    });
  }

  public async getUserByUsername(username: string): Promise<IQueryUser> {
    try {
      const users = await knexUser
        .select('user_id', 'username', 'password', 'role')
        .join('roles', 'roles.role_id', 'users.role_id')
        .where('username', username);

      return users.length === 0 ? null : users[0];
      //
    } catch (err) {
      throw err;
    }
  }
}

export default new User();
