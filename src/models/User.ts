import * as _ from 'lodash';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

import knex from '../providers/database';
import env from '../providers/env';

import ModelError from '../utils/model_error';
import { IQueryUser, IUser, UserToken } from '../interfaces/user';

export const tableName = 'users';

const usernameRegex = /^(?=.{5,32})[0-9a-zA-Z_]+$/;
const passwordRegex = /^(?=.{5,32})[0-9A-Za-z@$!%*#?&]+$/;

class User {
    public validateUser(user: IUser): void {
        if (user.username && !usernameRegex.test(user.username)) {
            throw new ModelError('Invalid username');
        }
        if (user.password && !passwordRegex.test(user.password)) {
            throw new ModelError('Invalid password');
        }
    }

    private hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, env.SALT_ROUND);
    }

    public comparePassword(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash);
    }

    public signJWT(user: IQueryUser): Promise<string> {
        const payload: UserToken = {
            user_id: user.user_id,
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
            const users = await knex(tableName)
                .select('user_id', 'username', 'password', 'role')
                .join('roles', 'roles.role_id', 'users.role_id')
                .where('username', username);

            return users.length === 0 ? null : users[0];
            //
        } catch (err) {
            throw err;
        }
    }

    public async update(username: string, user: IUser): Promise<number> {
        this.validateUser(user);

        if (user.password) {
            user.password = await this.hashPassword(user.password);
        }

        try {
            const filteredUser = _.pickBy(user, _.identity); // remove all falsy property
            return await knex(tableName).update(filteredUser).where('username', username);
        } catch (err) {
            if (err.code === 'ER_NO_REFERENCED_ROW_2') {
                throw new ModelError("role_id doesn't exist");
            }

            throw err;
        }
    }
}

export default new User();
