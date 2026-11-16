import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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

  const documentBuilderConfig = new DocumentBuilder()
    .setTitle('Recados api')
    .setDescription('')
    .setVersion('1')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, documentBuilderConfig);

  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
