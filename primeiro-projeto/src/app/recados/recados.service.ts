import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRecadoDto } from './dto/create-recado.dto';
import { UpdateRecadoDto } from './dto/update-recado.dto';
import { Recado } from './entities/recado.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class RecadosService {
  constructor(
    @InjectRepository(Recado)
    private readonly recadoRepository: Repository<Recado>,
  ) {}

  async create(recado: CreateRecadoDto): Promise<Recado> {
    const newRecado = this.recadoRepository.create({
      ...recado,
      lido: false,
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

  async updateOne(id: number, recado: UpdateRecadoDto): Promise<Recado> {
    const existingRecado = await this.findOneById(id);
    this.recadoRepository.merge(existingRecado, recado);
    return this.recadoRepository.save(existingRecado);
  }

  async removeOne(id: number): Promise<Recado> {
    const recado = await this.findOneById(id);
    return this.recadoRepository.remove(recado);
  }
}
