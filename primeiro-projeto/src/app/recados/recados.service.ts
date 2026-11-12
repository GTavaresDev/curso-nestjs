import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRecadoDto } from './dto/create-recado.dto';
import { UpdateRecadoDto } from './dto/update-recado.dto';
import { Recado } from './entities/recado.entity';
import type { Usuario } from '../usuarios/entities/usuario.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationDto } from '../common/dto/pagination.dto';
import { UsuariosService } from '../usuarios/usuarios.service';
import { RegexFactory } from '../common/regex/regex.factory';
import { TokenPayloadDto } from '../auth/dto/token-payload.dto';

@Injectable()
export class RecadosService {
  constructor(
    @InjectRepository(Recado)
    private readonly recadoRepository: Repository<Recado>,
    @Inject(forwardRef(() => UsuariosService))
    private readonly usuariosService: UsuariosService,
    private readonly regexFactory: RegexFactory,
  ) {}

  private async getUsuarioOrFail(id: number): Promise<Usuario> {
    return this.usuariosService.findOne(id);
  }

  async create(recadoDto: CreateRecadoDto, tokenPayload: TokenPayloadDto) {
    const de = await this.getUsuarioOrFail(tokenPayload.sub);
    const para = await this.getUsuarioOrFail(recadoDto.para);
    const newRecado = this.recadoRepository.create({
      texto: recadoDto.texto,
      lido: false,
      de,
      para,
    });

    return this.recadoRepository.save(newRecado);
  }

  async findAll(
    paginationDto: PaginationDto,
    tokenPayload?: TokenPayloadDto,
  ) {
    const { limit = 10, offset = 0 } = paginationDto;

    const where =
      tokenPayload?.role === 'admin'
        ? undefined
        : [
            { de: { id: tokenPayload?.sub } },
            { para: { id: tokenPayload?.sub } },
          ];

    const recados = await this.recadoRepository.find({
      where,
      skip: offset,
      take: limit,
      relations: {
        de: true,
        para: true,
      },
      select: {
        de: {
          id: true,
          name: true,
          email: true,
        },
        para: {
          id: true,
          name: true,
          email: true,
        },
      },
    });

    const removeSpaces = this.regexFactory.create('RemoveSpacesRegex');

    return recados.map((recado) => ({
      ...recado,
      texto: removeSpaces.execute(recado.texto),
    }));
  }

  async findByUsuarioId(id: number): Promise<Recado[]> {
    return this.recadoRepository.find({
      where: [{ de: { id } }, { para: { id } }],
      relations: {
        de: true,
        para: true,
      },
      select: {
        de: {
          id: true,
          name: true,
          email: true,
        },
        para: {
          id: true,
          name: true,
          email: true,
        },
      },
    });
  }

  async findOneById(id: number): Promise<Recado> {
    const recado = await this.recadoRepository.findOne({
      where: { id },
      relations: {
        de: true,
        para: true,
      },
    });
    if (recado) return recado;
    throw new NotFoundException('Recado não encontrado');
  }

  async updateOne(
    id: number,
    recadoDto: UpdateRecadoDto,
    tokenPayload: TokenPayloadDto,
  ) {
    const existingRecado = await this.findOneById(id);

    if (existingRecado.de.id !== tokenPayload.sub) {
      throw new ForbiddenException(
        'Você não tem autorização para alterar este recado.',
      );
    }

    const { para, ...rest } = recadoDto;

    this.recadoRepository.merge(existingRecado, rest);

    if (para !== undefined)
      existingRecado.para = await this.getUsuarioOrFail(para);

    return this.recadoRepository.save(existingRecado);
  }

  async removeOne(id: number, tokenPayload: TokenPayloadDto): Promise<Recado> {
    const recado = await this.findOneById(id);

    if (recado.de.id !== tokenPayload.sub) {
      throw new ForbiddenException(
        'Você não tem autorização para excluir este recado.',
      );
    }

    return this.recadoRepository.remove(recado);
  }
}
