import { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';

import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class MorganMiddleware implements NestMiddleware {
  private readonly morganMiddleware = morgan('dev');

  use(req: Request, res: Response, next: NextFunction) {
    this.morganMiddleware(req, res, next);
  }
}
