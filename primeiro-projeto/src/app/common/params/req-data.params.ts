import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const ReqDataParams = createParamDecorator(
  (data: keyof Request, contexto: ExecutionContext) => {
    const context = contexto.switchToHttp();
    const request: Request = context.getRequest();
    return request[data];
  },
);
