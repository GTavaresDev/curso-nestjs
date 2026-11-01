import { Injectable } from '@nestjs/common';

@Injectable()
export class HelloService {
    message(): string {
        return 'Olá mundo!'
    }
}
