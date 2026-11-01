import { Injectable } from '@nestjs/common';

@Injectable()
export class SalveService {
    salve(): string{
        return 'Salve!!'
    }
}
