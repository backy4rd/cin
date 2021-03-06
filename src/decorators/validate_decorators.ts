import * as _ from 'lodash';
import { expect } from 'chai';
import { Request, Response, NextFunction } from 'express';

export function mustExist(...requestKeyPaths: string[]) {
    return function (target: Object, propertyKey: string, descriptor: PropertyDescriptor) {
        const method = descriptor.value;

        descriptor.value = function (req: Request, res: Response, next: NextFunction) {
            const isAllExist = requestKeyPaths.every((keyPath) => {
                return _.get(req, keyPath) !== undefined;
            });

            expect(isAllExist, '400:Missing parameter').to.be.true;

            return method.apply(this, arguments);
        };
    };
}

export function mustExistOne(...requestKeyPaths: string[]) {
    return function (target: Object, propertyKey: string, descriptor: PropertyDescriptor) {
        const method = descriptor.value;

        descriptor.value = function (req: Request, res: Response, next: NextFunction) {
            const isExistOne = requestKeyPaths.some((keyPath) => {
                return _.get(req, keyPath) !== undefined;
            });

            expect(isExistOne, '400:Missing parameter').to.be.true;

            return method.apply(this, arguments);
        };
    };
}

export function isString(...requestKeyPaths: string[]) {
    return function (target: Object, propertyKey: string, descriptor: PropertyDescriptor) {
        const method = descriptor.value;

        descriptor.value = function (req: Request, res: Response, next: NextFunction) {
            const isAllString = requestKeyPaths.every((keyPath) => {
                return typeof _.get(req, keyPath) === 'string';
            });

            expect(isAllString, '400:Invalid parameter').to.be.true;

            return method.apply(this, arguments);
        };
    };
}

export function isNumber(...requestKeyPaths: string[]) {
    return function (target: Object, propertyKey: string, descriptor: PropertyDescriptor) {
        const method = descriptor.value;

        descriptor.value = function (req: Request, res: Response, next: NextFunction) {
            const isAllNumber = requestKeyPaths.every((keyPath) => {
                return typeof _.get(req, keyPath) === 'number';
            });

            expect(isAllNumber, '400:Invalid parameter').to.be.true;

            return method.apply(this, arguments);
        };
    };
}

export function parseDate(...requestKeyPaths: string[]) {
    return function (target: Object, propertyKey: string, descriptor: PropertyDescriptor) {
        const method = descriptor.value;

        descriptor.value = function (req: Request, res: Response, next: NextFunction) {
            requestKeyPaths.forEach((keyPath) => {
                const value = _.get(req, keyPath);
                _.set(req, keyPath, new Date(value));
            });

            return method.apply(this, arguments);
        };
    };
}

export function isDateFormat(...requestKeyPaths: string[]) {
    return function (target: Object, propertyKey: string, descriptor: PropertyDescriptor) {
        const method = descriptor.value;

        descriptor.value = function (req: Request, res: Response, next: NextFunction) {
            const isAllDate = requestKeyPaths.every((keyPath) => {
                const value = _.get(req, keyPath);
                return isNaN(Date.parse(value)) === false;
            });

            expect(isAllDate, '400:Invalid parameter').to.be.true;

            return method.apply(this, arguments);
        };
    };
}
