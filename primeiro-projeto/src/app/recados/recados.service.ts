import { Delete, Injectable } from '@nestjs/common';
import { Recado } from '../../interfaces/recados.interface';

@Injectable()
export class RecadosService {
  private readonly recados: Recado[] = [
    { id: 1, content: 'Este é um recado de teste 1' },
    { id: 2, content: 'Este é um recado de teste 2' },
  ];

  create(recado: Recado) {
    this.recados.push(recado);
  }

  findAll(): Recado[] {
    return this.recados;
  }

  findOneById(id: number) {
    const recado = this.recados.find((item) => item.id === id);
    return recado;
  }

  updateOne(id: number, recado: Recado) {
    const index = this.recados.findIndex((item) => item.id === id);

    this.recados[index] = {
      ...this.recados[index],
      ...recado,
      id,
    };

    return this.recados[index];
  }

  @Delete(':id')
  removeOne(id: number) {
    return this.recados.splice(id, 1);
  }
}
