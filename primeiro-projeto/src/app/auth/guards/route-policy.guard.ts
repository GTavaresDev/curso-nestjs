import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoutePolicies } from '../enum/route-poliies.enum';
import { REQUEST_TOKEN_PAYLOAD_KEY, ROUTE_POLICY_KEY } from '../auth.constants';
import { TokenPayloadDto } from '../dto/token-payload.dto';

@Injectable()
export class RoutePolicyGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const routePolicyRequired = this.reflector.get<RoutePolicies | undefined>(
      ROUTE_POLICY_KEY,
      context.getHandler(),
    );

    if (!routePolicyRequired) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const tokenPayload: TokenPayloadDto | undefined =
      request[REQUEST_TOKEN_PAYLOAD_KEY] ?? request.user;

    if (!tokenPayload) {
      throw new UnauthorizedException(
        'Acesso não autorizado para esta rota',
      );
    }

    switch (routePolicyRequired) {
      case RoutePolicies.findAllRecados:
        // 'admin' e 'user' têm permissão de acessar a rota findAllRecados
        if (tokenPayload.role === 'admin' || tokenPayload.role === 'user') {
          return true;
        }
        break;
    }

    throw new ForbiddenException('Usuário não tem permissão para acessar esta rota');
  }
}
