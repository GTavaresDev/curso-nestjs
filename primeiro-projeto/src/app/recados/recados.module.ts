import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecadosController } from './recados.controller';
import { RecadosService } from './recados.service';
import { Recado } from './entities/recado.entity';
import { UsuariosModule } from '../usuarios/usuarios.module';
import { RegexFactory } from '../common/regex/regex.factory';
import { EmailModule } from '../../email/email.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Recado]),
    forwardRef(() => UsuariosModule),
    EmailModule,
  ],
  controllers: [RecadosController],
  providers: [RecadosService, RegexFactory],
  exports: [RecadosService],
})
export class RecadosModule {}
