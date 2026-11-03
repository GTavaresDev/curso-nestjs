import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';
import { Task } from './entities/task.entity.js';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  async create(createTaskDto: CreateTaskDto) {
    const task = await this.taskRepository.create(createTaskDto);
    if (!task) {
      throw new NotFoundException(`Falha ao criar uma tarefa`);
    }
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
    const task = await this.taskRepository.findOneBy({ id });
    if (!task) {
      throw new NotFoundException(`Tarefa ${id} não encontrada `);
    }
    return task;
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
