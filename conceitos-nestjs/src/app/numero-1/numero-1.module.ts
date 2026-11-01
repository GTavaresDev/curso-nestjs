import { Module } from '@nestjs/common';
import { Numero1Controller } from './numero-1.controller';
import { Numero1Service } from './numero-1.service';

@Module({
  controllers: [Numero1Controller],
  providers: [Numero1Service]
})
export class Numero1Module {}
