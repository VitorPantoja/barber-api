export const RESULT_KIND = {
  ALREADY_EXISTS: 'ALREADY_EXISTS',
  CREATED: 'CREATED',
  ERROR: 'ERROR',
  ERROR_NO_CONTENT: 'ERROR_NO_CONTENT',
  NOT_FOUND: 'NOT_FOUND',
  SUCCESS: 'SUCCESS',
  SUCCESS_NO_CONTENT: 'SUCCESS_NO_CONTENT',
  UNAUTHORIZED: 'UNAUTHORIZED',
  UNAUTHORIZED_CREDENTIALS: 'UNAUTHORIZED_CREDENTIALS'
} as const;

export type ResultKind = (typeof RESULT_KIND)[keyof typeof RESULT_KIND];

export interface Success<T> {
  kind: typeof RESULT_KIND.SUCCESS;
  data: T;
}

export interface SuccessNoContent {
  kind: typeof RESULT_KIND.SUCCESS_NO_CONTENT;
}

export interface Created<T> {
  kind: typeof RESULT_KIND.CREATED;
  data: T;
}

export interface NotFound {
  kind: typeof RESULT_KIND.NOT_FOUND;
  message: string;
}

export interface AlreadyExists {
  kind: typeof RESULT_KIND.ALREADY_EXISTS;
  message: string;
}

export interface Unauthorized {
  kind: typeof RESULT_KIND.UNAUTHORIZED;
  message: string;
}

export interface UnauthorizedCredentials {
  kind: typeof RESULT_KIND.UNAUTHORIZED_CREDENTIALS;
  message: string;
}

export interface ErrorResult {
  kind: typeof RESULT_KIND.ERROR;
  message: string;
}

export interface ErrorNoContent {
  kind: typeof RESULT_KIND.ERROR_NO_CONTENT;
}

export type Result<T = void> =
  | Success<T>
  | SuccessNoContent
  | Created<T>
  | NotFound
  | AlreadyExists
  | Unauthorized
  | UnauthorizedCredentials
  | ErrorResult
  | ErrorNoContent;

export function success<T>(data: T): Success<T> {
  return { data, kind: RESULT_KIND.SUCCESS };
}

export function successNoContent(): SuccessNoContent {
  return { kind: RESULT_KIND.SUCCESS_NO_CONTENT };
}

export function created<T>(data: T): Created<T> {
  return { data, kind: RESULT_KIND.CREATED };
}

export function notFound(message: string): NotFound {
  return { kind: RESULT_KIND.NOT_FOUND, message };
}

export function alreadyExists(message: string): AlreadyExists {
  return { kind: RESULT_KIND.ALREADY_EXISTS, message };
}

export function unauthorized(message: string): Unauthorized {
  return { kind: RESULT_KIND.UNAUTHORIZED, message };
}

export function unauthorizedCredentials(message: string): UnauthorizedCredentials {
  return { kind: RESULT_KIND.UNAUTHORIZED_CREDENTIALS, message };
}

export function error(message: string): ErrorResult {
  return { kind: RESULT_KIND.ERROR, message };
}

export function errorNoContent(): ErrorNoContent {
  return { kind: RESULT_KIND.ERROR_NO_CONTENT };
}
