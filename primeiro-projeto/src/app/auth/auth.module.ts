import { Global, Module } from '@nestjs/common';
import { HashingServiceProtocol } from './hasing/hashing.protocol';
import { BcryptService } from './hasing/bcrypt.service';

@Global()
@Module({
  providers: [
    {
      provide: HashingServiceProtocol,
      useClass: BcryptService,
    },
  ],
  exports: [HashingServiceProtocol],
})
export class AuthModule {}
