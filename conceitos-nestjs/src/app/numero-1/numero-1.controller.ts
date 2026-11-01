import { Controller, Get } from '@nestjs/common';
import { Numero1Service } from './numero-1.service';

@Controller('numero-1')
export class Numero1Controller {
    constructor (private readonly numero1Service: Numero1Service){}

    @Get()
    numbe(): number { 
        return this.numero1Service.number()
    }
   
}
