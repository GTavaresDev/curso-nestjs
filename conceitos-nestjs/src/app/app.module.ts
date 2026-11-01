import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConceitosManualModule } from '../conceitos-manual/conceitos-manual.module';
import { ConceitosAutomaticoModule } from '../conceitos-automatico/conceitos-automatico.module';
import { Numero1Module } from './numero-1/numero-1.module';
import { HelloModule } from './hello/hello.module';
import { SalveModule } from './salve/salve.module';

@Module({
  imports: [ConceitosManualModule, ConceitosAutomaticoModule, Numero1Module, HelloModule, SalveModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
