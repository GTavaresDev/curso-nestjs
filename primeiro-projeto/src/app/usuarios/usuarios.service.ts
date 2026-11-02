import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usersRepository: Repository<Usuario>,
  ) {}

  create(createUserDto: CreateUsuarioDto) {
    const newUser = this.usersRepository.create({
      ...createUserDto,
    });

    return this.usersRepository.save(newUser);
  }

  async findAll() {
    const users = await this.usersRepository.find();
    if (users.length === 0) {
      throw new NotFoundException('Não temos usuários cadastrados no sistema');
    }
    return users;
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(
        'Não temos esse usuário cadastrado no sistema',
      );
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUsuarioDto) {
    const existingUser = await this.usersRepository.findOneBy({ id });
    if (!existingUser) {
      throw new NotFoundException(
        'Não temos esse usuário cadastrado no sistema',
      );
    }
    this.usersRepository.merge(existingUser, updateUserDto);
    return this.usersRepository.save(existingUser);
  }

  async remove(id: number) {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(
        'Não temos esse usuário cadastrado no sistema',
      );
    }
    return this.usersRepository.remove(user);
  }
}
