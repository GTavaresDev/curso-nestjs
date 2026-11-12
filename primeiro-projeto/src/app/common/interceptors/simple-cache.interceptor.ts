import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  Injectable,
} from '@nestjs/common';
import { of, tap } from 'rxjs';

@Injectable()
export class SimpleCacheInterceptor implements NestInterceptor {
  private readonly cache = new Map();
  async intercept(context: ExecutionContext, next: CallHandler<any>) {
    const request = context.switchToHttp().getRequest();
    const url = request.url;
    const isGetMethod = request.method === 'GET';

    if (isGetMethod && this.cache.has(url)) {
      console.log('Está no cache', url);
      return of(this.cache.get(url));
    }

    await new Promise((resolve) => setTimeout(resolve, 3000));
    return next.handle().pipe(
      tap((data) => {
        if (isGetMethod) {
          this.cache.set(url, data);
          console.log('Armazenado no cache', url);
        }
      }),
    );
  }
}
