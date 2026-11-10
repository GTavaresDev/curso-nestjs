import { Module } from '@nestjs/common';
import { HelloController } from './hello.controller';
import { HelloService } from './hello.service';
import { MyDynamicModule } from '../my-dynamic/my-dynamic.module';

@Module({
  imports: [
    MyDynamicModule.register({
      apiKey: 'API KEY',
      apiUrl: 'http://adasda.com.br',
    }),
  ],
  controllers: [HelloController],
  providers: [HelloService],
})
export class HelloModule {}
