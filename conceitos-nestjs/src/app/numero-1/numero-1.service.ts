import { Injectable } from '@nestjs/common';

@Injectable()
export class Numero1Service {
    number(): number {
        return 1
    }
}
