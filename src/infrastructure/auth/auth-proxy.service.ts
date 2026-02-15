import { type Request, type Response } from 'express';

import { Injectable } from '@nestjs/common';

import { type AuthInstance } from './auth.config';

@Injectable()
export class AuthProxyService {
  constructor(private readonly auth: AuthInstance) {}

  async handleRequest(req: Request, res: Response): Promise<void> {
    const url = new URL(req.originalUrl, `${req.protocol}://${req.get('host')}`);

    const headers = new Headers();
    for (const [key, value] of Object.entries(req.headers)) {
      if (value) {
        headers.set(key, Array.isArray(value) ? value.join(', ') : value);
      }
    }

    const webRequest = new Request(url.toString(), {
      body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined,
      headers,
      method: req.method
    });

    const response = await this.auth.handler(webRequest);

    response.headers.forEach(function (value, key) {
      res.setHeader(key, value);
    });

    res.status(response.status);

    const body = await response.text();
    res.send(body);
  }
}
