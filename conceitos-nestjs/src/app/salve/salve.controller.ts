import { Controller, Get } from '@nestjs/common';
import { SalveService } from './salve.service';

@Controller('salve')
export class SalveController {
    constructor (private readonly message: SalveService){}

    @Get()
    response(): string{
        return this.message.salve()
    }
}
