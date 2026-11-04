import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecadosController } from './recados.controller';
import { RecadosService } from './recados.service';
import { Recado } from './entities/recado.entity';
import { UsuariosModule } from '../usuarios/usuarios.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Recado]),
    forwardRef(() => UsuariosModule),
  ],
  controllers: [RecadosController],
  providers: [RecadosService],
  exports: [RecadosService],
})
export class RecadosModule {}
