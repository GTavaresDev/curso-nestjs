import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';
import { Task } from './entities/task.entity.js';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity.js';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createTaskDto: CreateTaskDto) {
    const user = await this.userRepository.findOneBy({ id: createTaskDto.name });
    if (!user) {
      throw new NotFoundException(`Usuário ${createTaskDto.name} não encontrado`);
    }

    const task = this.taskRepository.create({
      content: createTaskDto.content,
      user,
    });

    return this.taskRepository.save(task);
  }

  async findAll() {
    const tasks = await this.taskRepository.find({
      select: {
        user: {
          id: true,
          name: true,
        },
      },
      relations: {
        user: true,
      },
    });
    if (tasks.length === 0) {
      throw new NotFoundException(`Nenhuma tarefa encontrado`);
    }
    return tasks;
  }

  async findOne(id: number) {
    const task = await this.taskRepository.findOne({
      where: { id },
      select: {
        user: {
          id: true,
          name: true,
        },
      },
      relations: {
        user: true,
      },
    });
    if (!task) {
      throw new NotFoundException(`Tarefa ${id} não encontrada `);
    }
    return task;
  }

  async findTaskByUser(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`Usuário ${id} não encontrado`);
    }

    return this.taskRepository.find({
      where: { user: { id } },
      relations: { user: true },
    });
  }

  async update(id: number, updateTaskDto: UpdateTaskDto) {
    const task = await this.taskRepository.preload({
      id,
      ...updateTaskDto,
    });

    if (!task) {
      throw new NotFoundException(`Tarefa ${id} não encontrada`);
    }
    return this.taskRepository.save(task);
  }

  async remove(id: number) {
    const task = await this.findOne(id);
    return this.taskRepository.remove(task);
  }
}
