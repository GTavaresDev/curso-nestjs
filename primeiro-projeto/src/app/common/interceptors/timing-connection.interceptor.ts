import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { tap } from 'rxjs';

export class TimingConnectionInterceptor implements NestInterceptor {
  async intercept(context: ExecutionContext, next: CallHandler<any>) {
    const startTime = Date.now();
    return next.handle().pipe(
      tap(() => {
        const finalTime = Date.now();
        const elapsedTime = finalTime - startTime;
        console.log(`Duração: ${elapsedTime}ms`);
      }),
    );
  }
}
