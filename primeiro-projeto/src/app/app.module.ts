import {
  Logger,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RecadosModule } from './recados/recados.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import { UsuariosModule } from './usuarios/usuarios.module';
import { SimpleMiddleware } from './common/middleware/simple.middleware';
import { Step2Middleware } from './common/middleware/step2.middleware';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SimpleMiddleware, Step2Middleware).forRoutes({
      path: 'recados',
      method: RequestMethod.ALL,
    });
  }
}
