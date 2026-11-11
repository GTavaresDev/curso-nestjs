import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ParseIntPipe,
  Delete,
} from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { UrlParam } from '../common/params/url.params';
import { ReqDataParams } from '../common/params/req-data.params';
import { TokenPayloadParam } from '../auth/params/token-payload.param';
import { TokenPayloadDto } from '../auth/dto/token-payload.dto';

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
}
