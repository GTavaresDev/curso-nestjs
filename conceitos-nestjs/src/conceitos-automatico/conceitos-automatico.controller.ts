import { Controller, Get } from '@nestjs/common';
import { ConceitosAutomaticoService } from './conceitos-automatico.service';

@Controller('conceitos-automatico')
export class ConceitosAutomaticoController {
    constructor(private readonly conceitosAutomaticoSerive: ConceitosAutomaticoService){}

    @Get('hello')
    home(): string {
        return this.conceitosAutomaticoSerive.hello()
    }
}
