import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { Repository } from 'typeorm';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { HashingServiceProtocol } from './hasing/hashing.protocol';
import type { ConfigType } from '@nestjs/config';
import jwtConfig from './_config/jwt.config';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenDTO } from './dto/refresh-token.dto';

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
    if (throwError || !user) {
      throw new UnauthorizedException('Usuário ou senha invalido');
    }

    return this.generateTokens(user);
  }

  private async signJwt<T extends Record<string, any>>(
    sub: number,
    expiresIn: number,
    payload?: T,
  ) {
    return await this.jwtService.signAsync(
      {
        sub,
        ...payload,
      },
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
        expiresIn,
      },
    );
  }

  private async generateTokens(user: Usuario) {
    const [accessToken, refreshToken] = await Promise.all([
      this.signJwt(user.id, this.jwtConfiguration.ttl, { email: user.email }),
      this.signJwt(user.id, this.jwtConfiguration.jwtRefreshTtl),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshTokens(refreshTokenDTO: RefreshTokenDTO) {
    try {
      const { sub } = await this.jwtService.verifyAsync<{ sub: number }>(
        refreshTokenDTO.refreshToken,
        {
          secret: this.jwtConfiguration.secret,
          audience: this.jwtConfiguration.audience,
          issuer: this.jwtConfiguration.issuer,
        },
      );

      const user = await this.userRepository.findOneBy({ id: sub });

      if (!user) {
        throw new UnauthorizedException('Usuário não encontrado');
      }

      return this.generateTokens(user);
    } catch {
      throw new UnauthorizedException('Refresh token inválido ou expirado');
    }
  }
}
