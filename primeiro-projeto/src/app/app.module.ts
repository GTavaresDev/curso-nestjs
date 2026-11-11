import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RecadosModule } from './recados/recados.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import { UsuariosModule } from './usuarios/usuarios.module';
import { SimpleMiddleware } from './common/middleware/simple.middleware';
import { Step2Middleware } from './common/middleware/step2.middleware';
import { APP_FILTER } from '@nestjs/core';
import { MyExceptionFilter } from './common/filters/my-exception.filter';
import { UsuariosController } from './usuarios/usuarios.controller';
import { RecadosController } from './recados/recados.controller';
import { AuthModule } from './auth/auth.module';

const databaseLogger = new Logger('Database');

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.getOrThrow<string>('DATABASE_URL'),
        autoLoadEntities: true,
        synchronize: true,
        dataSourceFactory: async (options: DataSourceOptions) => {
          const dataSource = await new DataSource(options).initialize();
          databaseLogger.log('Banco de dados conectado com sucesso');
          return dataSource;
        },
      }),
    }),
    RecadosModule,
    UsuariosModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: MyExceptionFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(SimpleMiddleware, Step2Middleware)
      .forRoutes(RecadosController);

    consumer.apply(SimpleMiddleware).forRoutes(UsuariosController);
  }
}
