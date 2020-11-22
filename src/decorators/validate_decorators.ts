import * as _ from 'lodash';
import { expect } from 'chai';
import { Request, Response, NextFunction } from 'express';

export function mustExist(requestKeyPathss: string[] | string) {
  return function (
    target: Object,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const method = descriptor.value;

    descriptor.value = function (
      req: Request,
      res: Response,
      next: NextFunction,
    ) {
      if (!Array.isArray(requestKeyPathss)) {
        requestKeyPathss = [requestKeyPathss];
      }

      const isAllExist = requestKeyPathss.every((keyPath) => {
        return _.get(req, keyPath) !== undefined;
      });

      expect(isAllExist, '400:Missing parameter').to.be.true;

      return method.apply(this, arguments);
    };
  };
}

export function mustExistOne(requestKeyPaths: string[] | string) {
  return function (
    target: Object,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const method = descriptor.value;

    descriptor.value = function (
      req: Request,
      res: Response,
      next: NextFunction,
    ) {
      if (!Array.isArray(requestKeyPaths)) {
        requestKeyPaths = [requestKeyPaths];
      }

      const isExistOne = requestKeyPaths.some((keyPath) => {
        return _.get(req, keyPath) !== undefined;
      });

      expect(isExistOne, '400:Missing parameter').to.be.true;

      return method.apply(this, arguments);
    };
  };
}

export function isString(requestKeyPaths: string[] | string) {
  return function (
    target: Object,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const method = descriptor.value;

    descriptor.value = function (
      req: Request,
      res: Response,
      next: NextFunction,
    ) {
      if (!Array.isArray(requestKeyPaths)) {
        requestKeyPaths = [requestKeyPaths];
      }

      const isAllString = requestKeyPaths.every((keyPath) => {
        return typeof _.get(req, keyPath) === 'string';
      });

      expect(isAllString, '400:Invalid parameter').to.be.true;

      return method.apply(this, arguments);
    };
  };
}

export function isNumber(requestKeyPaths: string[] | string) {
  return function (
    target: Object,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const method = descriptor.value;

    descriptor.value = function (
      req: Request,
      res: Response,
      next: NextFunction,
    ) {
      if (!Array.isArray(requestKeyPaths)) {
        requestKeyPaths = [requestKeyPaths];
      }

      const isAllNumber = requestKeyPaths.every((keyPath) => {
        return typeof _.get(req, keyPath) === 'number';
      });

      expect(isAllNumber, '400:Invalid parameter').to.be.true;

      return method.apply(this, arguments);
    };
  };
}

export function parseDate(requestKeyPaths: string[] | string) {
  return function (
    target: Object,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const method = descriptor.value;

    descriptor.value = function (
      req: Request,
      res: Response,
      next: NextFunction,
    ) {
      if (!Array.isArray(requestKeyPaths)) {
        requestKeyPaths = [requestKeyPaths];
      }

      requestKeyPaths.forEach((keyPath) => {
        const value = _.get(req, keyPath);
        _.set(req, keyPath, new Date(value));
      });

      return method.apply(this, arguments);
    };
  };
}

export function isDateFormat(requestKeyPaths: string[] | string) {
  return function (
    target: Object,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const method = descriptor.value;

    descriptor.value = function (
      req: Request,
      res: Response,
      next: NextFunction,
    ) {
      if (!Array.isArray(requestKeyPaths)) {
        requestKeyPaths = [requestKeyPaths];
      }

      const isAllDate = requestKeyPaths.every((keyPath) => {
        const value = _.get(req, keyPath);
        return isNaN(Date.parse(value)) === false;
      });

      expect(isAllDate, '400:Invalid parameter').to.be.true;

      return method.apply(this, arguments);
    };
  };
}
