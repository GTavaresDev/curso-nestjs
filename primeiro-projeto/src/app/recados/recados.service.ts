import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRecadoDto } from './dto/create-recado.dto';
import { UpdateRecadoDto } from './dto/update-recado.dto';
import { Recado } from './entities/recado.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class RecadosService {
  constructor(
    @InjectRepository(Recado)
    private readonly recadoRepository: Repository<Recado>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}
  private async getUsuarioOrFail(id: number): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOneBy({ id });
    if (!usuario) {
      throw new NotFoundException(`Usuário com id ${id} não encontrado`);
    }
    return usuario;
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

  async findAll() {
    const recados = await this.recadoRepository.find();
    return recados;
  }

  async findOneById(id: number): Promise<Recado> {
    const recado = await this.recadoRepository.findOneBy({ id });
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
