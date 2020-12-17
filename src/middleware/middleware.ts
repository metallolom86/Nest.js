import { Injectable, NestMiddleware, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

const whiteList = ['/auth/login', '/auth/register']

@Injectable()
export class LoggerMiddleware implements NestMiddleware {

  use(req: Request, res: Response, next: Function) {
    const authHeaders = req.headers.authorization;
    if ( req.method === "GET") {
      next();
      return;
    }
    if(whiteList.includes(req.baseUrl)){
      next();
      return;
    }

    if (authHeaders && (authHeaders as string).split(' ')[1]) {
      const token = (authHeaders as string).split(' ')[1];
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET);

      if (!decoded) {
        throw new UnauthorizedException();
      }
      next();

    } else {
      throw new UnauthorizedException();
    }
  }
}
// if(req.method === "GET") next();
// throw new UnauthorizedException();