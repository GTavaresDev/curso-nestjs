import { forwardRef, Module } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';
import { Recado } from '../recados/entities/recado.entity';
import { RecadosModule } from '../recados/recados.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario, Recado]),
    forwardRef(() => RecadosModule),
  ],
  controllers: [UsuariosController],
  providers: [UsuariosService],
  exports: [UsuariosService],
})
export class UsuariosModule {}
