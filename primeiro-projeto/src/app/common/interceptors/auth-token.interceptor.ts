import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  UnauthorizedException,
} from '@nestjs/common';

export class AuthTokenInterceptor implements NestInterceptor {
  async intercept(context: ExecutionContext, next: CallHandler<any>) {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];

    if (!token || token != 'Token30') {
      throw new UnauthorizedException(`Usuário sem permissão`);
    }
    console.log(`Token: ${token} ✔️`);
    return next.handle();
  }
}
