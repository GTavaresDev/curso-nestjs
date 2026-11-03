import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';
import { Recado } from '../recados/entities/recado.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usersRepository: Repository<Usuario>,
    @InjectRepository(Recado)
    private readonly recadoRepository: Repository<Recado>,
  ) {}

  async create(createUserDto: CreateUsuarioDto) {
    try {
      const newUser = await this.usersRepository.create({
        ...createUserDto,
      });
      return await this.usersRepository.save(newUser);
    } catch (error) {
      if (this.isDuplicateEmailError(error)) {
        throw new ConflictException('E-mail já está configurado');
      }
      throw error;
    }
  }

  async findAll() {
    const users = await this.usersRepository.find();

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

    try {
      return await this.usersRepository.save(existingUser);
    } catch (error) {
      if (this.isDuplicateEmailError(error)) {
        throw new ConflictException('E-mail já está configurado');
      }
      throw error;
    }
  }

  async remove(id: number) {
    const user = await this.usersRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(
        'Não temos esse usuário cadastrado no sistema',
      );
    }

    try {
      // Apaga todos os recados em que o usuário é remetente OU destinatário
      await this.recadoRepository.delete([{ de: { id } }, { para: { id } }]);
    } catch {
      throw new NotFoundException(
        'Não foi possivel apagar os recados desse usuario ',
      );
    }
    return this.usersRepository.remove(user);
  }

  private isDuplicateEmailError(error: unknown): boolean {
    return (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === '23505'
    );
  }
}
