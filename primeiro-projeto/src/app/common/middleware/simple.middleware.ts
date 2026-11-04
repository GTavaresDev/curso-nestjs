import { NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: {
        tag: string;
      };
    }
  }
}

export class SimpleMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('SimpleMiddleware: Olá');

    //Termina a cadeia de chamadas (mata o request)
    // return res.status(404).send({
    //   message: 'Não encontrado',
    // });
    const authorization = req.headers?.authorization;
    if (authorization) {
      req.user = {
        tag: 'Admin',
      };
    }
    next();

    res.on('finish', () => {
      console.log('Sua conexão com o servidor acabou!');
    });
  }
}
