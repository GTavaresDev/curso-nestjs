import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRecadoDto } from './dto/create-recado.dto';
import { UpdateRecadoDto } from './dto/update-recado.dto';
import type { Recado } from './entities/recado.entity';

@Injectable()
export class RecadosService {
  private readonly recados: Recado[] = [
    {
      id: 1,
      texto: 'Este é um recado',
      de: 'Joana',
      para: 'João',
      lido: false,
      data: new Date(),
    },
  ];

  create(recado: CreateRecadoDto): Recado {
    const newRecado: Recado = {
      id: this.recados.reduce(
        (lastId, currentRecado) => Math.max(lastId, currentRecado.id),
        0,
      ) + 1,
      ...recado,
      lido: false,
      data: new Date(),
    };

    this.recados.push(newRecado);
    return newRecado;
  }

  findAll(): Recado[] {
    return this.recados;
  }

  findOneById(id: number) {
    const recado = this.recados.find((item) => item.id === id);
    if (recado) return recado;
    throw new NotFoundException('Recado não encontrado');
  }

  updateOne(id: number, recado: UpdateRecadoDto): Recado {
    const index = this.findIndexById(id);

    this.recados[index] = {
      ...this.recados[index],
      ...recado,
      id,
    };

    return this.recados[index];
  }

  removeOne(id: number) {
    const index = this.findIndexById(id);

    const [removed] = this.recados.splice(index, 1);
    return removed;
  }

  private findIndexById(id: number): number {
    const index = this.recados.findIndex((item) => item.id === id);
    if (index !== -1) return index;
    throw new NotFoundException('Recado não encontrado');
  }
}
