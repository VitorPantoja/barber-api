import { type Request, type Response } from 'express';

import { All, Controller, Req, Res } from '@nestjs/common';

import { AuthProxyService } from './auth-proxy.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authProxyService: AuthProxyService) {}

  @All('*path')
  async handleAuth(@Req() req: Request, @Res() res: Response) {
    return this.authProxyService.handleRequest(req, res);
  }
}
