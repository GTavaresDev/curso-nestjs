import {
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

@Injectable()
export class RecadosService {
  constructor(
    @InjectRepository(Recado)
    private readonly recadoRepository: Repository<Recado>,
    @Inject(forwardRef(() => UsuariosService))
    private readonly usuariosService: UsuariosService,
  ) {}
  private async getUsuarioOrFail(id: number): Promise<Usuario> {
    return this.usuariosService.findOne(id);
  }

  async create(recadoDto: CreateRecadoDto) {
    const de = await this.getUsuarioOrFail(recadoDto.de);
    const para = await this.getUsuarioOrFail(recadoDto.para);
    const newRecado = this.recadoRepository.create({
      texto: recadoDto.texto,
      lido: false,
      de,
      para,
    });

    return this.recadoRepository.save(newRecado);
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    const recados = await this.recadoRepository.find({
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
    return recados;
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

  async updateOne(id: number, recadoDto: UpdateRecadoDto) {
    const existingRecado = await this.recadoRepository.findOneBy({ id });
    if (!existingRecado) {
      throw new NotFoundException(`Recado ${id} não encontrado`);
    }

    const { de, para, ...rest } = recadoDto;

    this.recadoRepository.merge(existingRecado, rest);

    if (de !== undefined) existingRecado.de = await this.getUsuarioOrFail(de);
    if (para !== undefined)
      existingRecado.para = await this.getUsuarioOrFail(para);

    return this.recadoRepository.save(existingRecado);
  }

  async removeOne(id: number): Promise<Recado> {
    const recado = await this.findOneById(id);
    return this.recadoRepository.remove(recado);
  }
}
