import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { Repository } from 'typeorm';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { HashingServiceProtocol } from './hasing/hashing.protocol';
import type { ConfigType } from '@nestjs/config';
import jwtConfig from './_config/jwt.config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private readonly userRepository: Repository<Usuario>,
    private readonly hashingService: HashingServiceProtocol,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly jwtService: JwtService,
  ) {}
  async login(loginDto: LoginDto) {
    let passwordIsValid = false;
    let throwError = true;

    //Verificação se user e senha existem
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

    //Assinar e entregar token JWT para o User
    const accessToken = await this.jwtService.signAsync(
      {
        sub: user?.id,
      },
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
        expiresIn: this.jwtConfiguration.ttl,
      },
    );
    return { accessToken };
  }
}
