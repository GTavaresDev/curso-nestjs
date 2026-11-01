import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Delete,
} from '@nestjs/common';
import { RecadosService } from './recados.service';
import type { Recado } from '../../interfaces/recados.interface';

@Controller('recados')
export class RecadosController {
  constructor(private readonly recados: RecadosService) {}
  @HttpCode(HttpStatus.OK)
  @Get()
  findAll(): Recado[] {
    return this.recados.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.recados.findOneById(id);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post()
  createRecado(@Body() recado: Recado) {
    return this.recados.create(recado);
  }

  @Patch(':id')
  updateRecado(@Param('id', ParseIntPipe) id: number, @Body() recado: Recado) {
    return this.recados.updateOne(id, recado);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.recados.removeOne(id);
  }
}
