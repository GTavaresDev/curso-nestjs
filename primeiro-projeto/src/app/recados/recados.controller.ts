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
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
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
  @UseInterceptors(
    FilesInterceptor('fotos', 10, {
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB por arquivo
      },
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
          return cb(
            new BadRequestException(
              'Apenas imagens (jpg, jpeg, png, webp) são permitidas.',
            ),
            false,
          );
        }
        cb(null, true);
      },
      storage: diskStorage({
        destination: './uploads/recados',
        filename: (req, file, cb) => {
          const fileExtension = path.extname(file.originalname).toLowerCase();
          const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${fileExtension}`;
          cb(null, fileName);
        },
      }),
    }),
  )
  createRecado(
    @Body() recado: CreateRecadoDto,
    @TokenPayloadParam() tokenPayload: TokenPayloadDto,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    return this.recados.create(recado, tokenPayload, files);
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
