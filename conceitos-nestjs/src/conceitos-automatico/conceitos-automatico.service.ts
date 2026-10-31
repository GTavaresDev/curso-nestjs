import { Injectable } from '@nestjs/common';

@Injectable()
export class ConceitosAutomaticoService {
  
    hello(): string {
        return 'Olá'
    }
}
