import type { Result } from '../../core/domain/result';
import { httpResultMap, type NestResponseLike } from './http.consts';

export function mapResultToHttp<T>(res: NestResponseLike, result: Result<T>) {
  const handler = httpResultMap[result.kind];
  return handler(res, result as never);
}
