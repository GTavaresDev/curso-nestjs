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
  Req,
  UseGuards,
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
import type { Request } from 'express';
import { IsPublic } from '../common/params/is-public.decorator';
import { TokenPayloadParam } from '../auth/params/token-payload.param';
import { TokenPayloadDto } from '../auth/dto/token-payload.dto';
import { SetRoutePolicy } from '../auth/decorator/set-route-policy.decorator';
import { RoutePolicies } from '../auth/enum/route-poliies.enum';
import { RoutePolicyGuard } from '../auth/guards/route-policy.guard';

@Controller('recados')
@UsePipes(ParseIntIdPipe)
@UseInterceptors(SimpleCacheInterceptor)
@UseGuards(RoutePolicyGuard)
export class RecadosController {
  constructor(private readonly recados: RecadosService) {}

  @HttpCode(HttpStatus.OK)
  @UseInterceptors(AddHeaderInterceptor, TimingConnectionInterceptor)
  @Get()
  @SetRoutePolicy(RoutePolicies.findAllRecados)
  findAll(
    @Query() paginationDto: PaginationDto,
    @TokenPayloadParam() tokenPayload: TokenPayloadDto,
  ): Promise<Recado[]> {
    return this.recados.findAll(paginationDto, tokenPayload);
  }

  @IsPublic()
  @UseInterceptors(TimingConnectionInterceptor, ErrorHandlingInterceptor)
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.recados.findOneById(id);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post()
  createRecado(
    @Body() recado: CreateRecadoDto,
    @TokenPayloadParam() tokenPayload: TokenPayloadDto,
  ) {
    return this.recados.create(recado, tokenPayload);
  }

  @Patch(':id')
  updateRecado(
    @Param('id') id: number,
    @Body() recado: UpdateRecadoDto,
    @TokenPayloadParam() tokenPayload: TokenPayloadDto,
  ) {
    return this.recados.updateOne(id, recado, tokenPayload);
  }

  @Delete(':id')
  remove(
    @Param('id') id: number,
    @TokenPayloadParam() tokenPayload: TokenPayloadDto,
  ) {
    return this.recados.removeOne(id, tokenPayload);
  }
}
