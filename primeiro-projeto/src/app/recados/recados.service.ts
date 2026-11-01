import { Injectable } from '@nestjs/common';
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

  findOne(id: number) {
    const recado = this.recados.find((item) => item.id === id);
    return recado;
  }
}
