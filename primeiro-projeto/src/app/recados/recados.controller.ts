import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { RecadosService } from './recados.service';
import { Recado } from '../../interfaces/recados.interface';

@Controller('recados')
export class RecadosController {
  constructor(private readonly recados: RecadosService) {}
  @Get()
  findAll(): Recado[] {
    return this.recados.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.recados.findOne(id);
  }
}
