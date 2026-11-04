import { Module } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';
import { Recado } from '../recados/entities/recado.entity';
import { APP_GUARD } from '@nestjs/core';
import { IsAdminGuards } from '../common/guards/is-admin.guards';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario, Recado])],
  controllers: [UsuariosController],
  providers: [
    UsuariosService,
    {
      provide: APP_GUARD,
      useClass: IsAdminGuards,
    },
  ],
})
export class UsuariosModule {}
