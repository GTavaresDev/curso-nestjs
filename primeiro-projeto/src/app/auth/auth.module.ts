import { Global, Module } from '@nestjs/common';
import { HashingServiceProtocol } from './hasing/hashing.protocol';
import { BcryptService } from './hasing/bcrypt.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from './_config/jwt.config';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario]),
    ConfigModule.forFeature(jwtConfig),
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: HashingServiceProtocol,
      useClass: BcryptService,
    },
    AuthService,
  ],
  exports: [HashingServiceProtocol],
})
export class AuthModule {}
