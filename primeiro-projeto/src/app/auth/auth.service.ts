import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { Repository } from 'typeorm';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { HashingServiceProtocol } from './hasing/hashing.protocol';
import type { ConfigType } from '@nestjs/config';
import jwtConfig from './_config/jwt.config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private readonly userRepository: Repository<Usuario>,
    private readonly hashingService: HashingServiceProtocol,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {
    console.log(jwtConfiguration);
  }
  async login(loginDto: LoginDto) {
    let passwordIsValid = false;
    let throwError = true;
    const user = await this.userRepository.findOneBy({
      email: loginDto.email,
    });

    if (user) {
      passwordIsValid = await this.hashingService.compare(
        loginDto.passwordHash,
        user.passwordHash,
      );
    }
    if (passwordIsValid) {
      throwError = false;
    }
    if (throwError) {
      throw new UnauthorizedException('Usuário ou senha invalido');
    }
    return loginDto;
  }
}
