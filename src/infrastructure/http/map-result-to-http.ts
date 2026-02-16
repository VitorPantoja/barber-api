import { created, RESULT_KIND, success, type Result } from '../../core/domain/result';
import { httpResultMap, type NestResponseLike } from './http.consts';

export { type NestResponseLike };

export function mapResultToHttp<T>(res: NestResponseLike, result: Result<T>) {
  const handler = httpResultMap[result.kind];
  return handler(res, result as never);
}

export function mapResultWithPresenter<T, U>(
  res: NestResponseLike,
  result: Result<T>,
  presenter: (this: void, data: T) => U
) {
  if (result.kind === RESULT_KIND.SUCCESS) {
    return mapResultToHttp(res, success(presenter(result.data)));
  }
  if (result.kind === RESULT_KIND.CREATED) {
    return mapResultToHttp(res, created(presenter(result.data)));
  }

  return mapResultToHttp(res, result);
}
