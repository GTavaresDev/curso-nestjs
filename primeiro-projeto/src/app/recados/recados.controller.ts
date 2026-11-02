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
import { CreateRecadoDto } from './dto/create-recado.dto';
import { UpdateRecadoDto } from './dto/update-recado.dto';
import type { Recado } from './entities/recado.entity';

@Controller('recados')
export class RecadosController {
  constructor(private readonly recados: RecadosService) {}
  @HttpCode(HttpStatus.OK)
  @Get()
  findAll(): Promise<Recado[]> {
    return this.recados.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.recados.findOneById(id);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post()
  createRecado(@Body() recado: CreateRecadoDto) {
    return this.recados.create(recado);
  }

  @Patch(':id')
  updateRecado(
    @Param('id', ParseIntPipe) id: number,
    @Body() recado: UpdateRecadoDto,
  ) {
    return this.recados.updateOne(id, recado);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.recados.removeOne(id);
  }
}
