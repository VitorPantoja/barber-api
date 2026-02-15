import type {
  AlreadyExists,
  Created,
  ErrorResult,
  NotFound,
  Result,
  ResultKind,
  Success,
  Unauthorized,
  UnauthorizedCredentials
} from '../../core/domain/result';
import { RESULT_KIND } from '../../core/domain/result';
import { nestErrorPayload } from './nest-error-payload';

export type NestResponseLike = {
  status: (code: number) => void;
};

export const httpResultMap: {
  [K in ResultKind]: (res: NestResponseLike, result: Extract<Result, { kind: K }>) => unknown;
} = {
  [RESULT_KIND.ALREADY_EXISTS]: (res: NestResponseLike, result: AlreadyExists) => {
    res.status(409);
    return nestErrorPayload('Conflict', result.message, 409);
  },

  [RESULT_KIND.CREATED]: <T>(res: NestResponseLike, result: Created<T>) => {
    res.status(201);
    return result.data;
  },

  [RESULT_KIND.ERROR]: (res: NestResponseLike, result: ErrorResult) => {
    res.status(500);
    return nestErrorPayload('Internal Server Error', result.message, 500);
  },

  [RESULT_KIND.ERROR_NO_CONTENT]: (res: NestResponseLike) => {
    res.status(204);
    return null;
  },

  [RESULT_KIND.NOT_FOUND]: (res: NestResponseLike, result: NotFound) => {
    res.status(404);
    return nestErrorPayload('Not Found', result.message, 404);
  },

  [RESULT_KIND.SUCCESS]: <T>(res: NestResponseLike, result: Success<T>) => {
    res.status(200);
    return result.data;
  },

  [RESULT_KIND.SUCCESS_NO_CONTENT]: (res: NestResponseLike) => {
    res.status(204);
    return null;
  },

  [RESULT_KIND.UNAUTHORIZED]: (res: NestResponseLike, result: Unauthorized) => {
    res.status(401);
    return nestErrorPayload('Unauthorized', result.message, 401);
  },

  [RESULT_KIND.UNAUTHORIZED_CREDENTIALS]: (res: NestResponseLike, result: UnauthorizedCredentials) => {
    res.status(401);
    return nestErrorPayload('Unauthorized', result.message, 401);
  }
};
