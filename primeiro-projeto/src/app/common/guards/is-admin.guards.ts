import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class IsAdminGuards implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const role = request['user']?.tag;
    if (role === 'Admin') {
      console.log(`Olá usuario ${role} ✔️`);
      return true;
    }
    return false;
  }
}
