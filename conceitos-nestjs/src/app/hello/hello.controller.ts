import { Controller, Get } from '@nestjs/common';
import { HelloService } from './hello.service';

@Controller('hello')
export class HelloController {
    constructor (private readonly message: HelloService){}

    @Get()
    hello(): string{
        return this.message.message()
    }
}
