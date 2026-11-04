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
  Query,
  UsePipes,
  UseInterceptors,
} from '@nestjs/common';
import { RecadosService } from './recados.service';
import { CreateRecadoDto } from './dto/create-recado.dto';
import { UpdateRecadoDto } from './dto/update-recado.dto';
import type { Recado } from './entities/recado.entity';
import { PaginationDto } from '../common/dto/pagination.dto';
import { ParseIntIdPipe } from '../common/pipes/parse-int-id.pipe';
import { AddHeaderInterceptor } from '../common/interceptors/add-header.interceptor';
import { TimingConnectionInterceptor } from '../common/interceptors/timing-connection.interceptor';
import { ErrorHandlingInterceptor } from '../common/interceptors/error-handling.interceptor';
import { SimpleCacheInterceptor } from '../common/interceptors/simple-cache.interceptor';

@Controller('recados')
@UsePipes(ParseIntIdPipe)
@UseInterceptors(SimpleCacheInterceptor)
export class RecadosController {
  constructor(private readonly recados: RecadosService) {}

  @HttpCode(HttpStatus.OK)
  @UseInterceptors(AddHeaderInterceptor, TimingConnectionInterceptor)
  @Get()
  findAll(@Query() paginationDto: PaginationDto): Promise<Recado[]> {
    return this.recados.findAll(paginationDto);
  }
  @UseInterceptors(TimingConnectionInterceptor, ErrorHandlingInterceptor)
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.recados.findOneById(id);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post()
  createRecado(@Body() recado: CreateRecadoDto) {
    return this.recados.create(recado);
  }

  @Patch(':id')
  updateRecado(@Param('id') id: number, @Body() recado: UpdateRecadoDto) {
    return this.recados.updateOne(id, recado);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.recados.removeOne(id);
  }
}
