import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ParseIntPipe,
  Delete,
  UseInterceptors,
  UploadedFile,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import * as fs from 'fs';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { UrlParam } from '../common/params/url.params';
import { ReqDataParams } from '../common/params/req-data.params';
import { TokenPayloadParam } from '../auth/params/token-payload.param';
import { TokenPayloadDto } from '../auth/dto/token-payload.dto';
import { ImageFileValidationPipe } from '../common/pipes/image-file-validation.pipe';
import { IsPublic } from '../common/params/is-public.decorator';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post()
  create(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuariosService.create(createUsuarioDto);
  }

  @Get()
  async findAll(
    @UrlParam() url: string,
    @ReqDataParams('headers') headers: Request,
  ) {
    console.log(url);
    console.log(headers);
    return await this.usuariosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usuariosService.findOne(+id);
  }

  @Get(':id/recados')
  findRecados(@Param('id', ParseIntPipe) id: number) {
    return this.usuariosService.findRecados(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
    @TokenPayloadParam() tokenPayload: TokenPayloadDto,
  ) {
    return this.usuariosService.update(id, updateUsuarioDto, tokenPayload);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usuariosService.remove(+id);
  }

  @Post('upload-picture')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 5 * 1024 * 1024, // Limite de 5MB
      },
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const fileExtension = path.extname(file.originalname).toLowerCase();
          const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${fileExtension}`;
          cb(null, fileName);
        },
      }),
    }),
  )
  uploadPicture(
    @UploadedFile(
      new ImageFileValidationPipe({
        maxSizeBytes: 5 * 1024 * 1024, // 5MB
        required: true,
      }),
    )
    file: Express.Multer.File,
    @TokenPayloadParam() tokenPayload: TokenPayloadDto,
  ) {
    return this.usuariosService.uploadPicture(file, tokenPayload);
  }

  @IsPublic()
  @Get(':id/picture')
  async getPicture(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    const user = await this.usuariosService.findOne(id);

    if (!user.picture || !fs.existsSync(user.picture)) {
      return res.status(404).json({
        statusCode: 404,
        message: 'Foto de perfil não encontrada para este usuário',
      });
    }

    const absolutePath = path.resolve(user.picture);
    return res.sendFile(absolutePath);
  }
}
