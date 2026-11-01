import { Module } from '@nestjs/common';
import { SalveController } from './salve.controller';
import { SalveService } from './salve.service';

@Module({
  controllers: [SalveController],
  providers: [SalveService]
})
export class SalveModule {}
