import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UrlParam = createParamDecorator(
  (data: unknown, contexto: ExecutionContext) => {
    const context = contexto.switchToHttp();
    const request: Request = context.getRequest();
    return request.url;
  },
);
