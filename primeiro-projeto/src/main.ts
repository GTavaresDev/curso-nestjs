import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  //Valida os campos do dto
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true, // remove chaves não validadas no dto
      forbidNonWhitelisted: true, // retornar que o campo errado não pertence ao boddy
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
