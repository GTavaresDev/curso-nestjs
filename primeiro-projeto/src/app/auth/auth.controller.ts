import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { IsPublic } from '../common/params/is-public.decorator';
import { RefreshTokenDTO } from './dto/refresh-token.dto';

@IsPublic()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('refresh')
  refreshTokens(@Body() refreshTokenDTO: RefreshTokenDTO) {
    return this.authService.refreshTokens(refreshTokenDTO);
  }
}
