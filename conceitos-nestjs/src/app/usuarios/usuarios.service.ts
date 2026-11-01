import { Injectable } from '@nestjs/common';
import { User } from './interfaces/usuarios.interface';

@Injectable()
export class UsuariosService {
    private readonly usuarios: User[] = [
        {id: 1, name: 'Gabriel', age: 20},
        {id: 2, name: 'Tavares', age: 21}
    ]
    listAllUsers(): User[]{
        return this.usuarios
    }

    listUser(id: number): User[]{
        const user = this.usuarios.filter(item => item.id === id)
        return user
    }

    createUser(usuario: User){
         this.usuarios.push(usuario)
    }

    updateUsuarios(id: number, usuarios: User) {
    const index = this.usuarios.findIndex((item) => item.id === id);

    this.usuarios[index] = {
      ...this.usuarios[index],
      ...usuarios,
      id,
    };

    return this.usuarios[index];
  }

  deleteUser(id: number){
    const index = this.usuarios.findIndex(item => item.id === id)
    return this.usuarios.splice(index, 1)
  }
}
