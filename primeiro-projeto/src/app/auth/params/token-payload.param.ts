import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { REQUEST_TOKEN_PAYLOAD_KEY } from '../auth.constants';
import { TokenPayloadDto } from '../dto/token-payload.dto';

export const TokenPayloadParam = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): TokenPayloadDto | undefined => {
    const context = ctx.switchToHttp();
    const request = context.getRequest<Record<string, any>>();
    return request[REQUEST_TOKEN_PAYLOAD_KEY];
  },
);
