import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { User } from './entities/user.entity.js';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from '../tasks/entities/task.entity.js';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Task)
    private readonly taskRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = await this.userRepository.create(createUserDto);
    if (!user) {
      throw new NotFoundException(`Falha ao criar o usuário`);
    }
    return this.userRepository.save(user);
  }

  async findAll() {
    const users = await this.userRepository.find();
    if (users.length === 0) {
      throw new NotFoundException(`Não há usuários no sistema`);
    }
    return users;
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`Usuário ${id} não encontrado`);
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.preload({
      id,
      ...updateUserDto,
    });
    if (!user) {
      throw new NotFoundException(`Usuario ${id} não encontrado`);
    }
    return this.userRepository.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    try {
      await this.taskRepository.delete([{ idTask: { id } }]);
    } catch {
      throw new NotFoundException(
        'Não foi possivel apagar os recados desse usuario ',
      );
    }
    return this.userRepository.remove(user);
  }
}
