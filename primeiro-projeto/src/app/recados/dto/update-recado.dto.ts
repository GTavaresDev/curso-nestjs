import { PartialType } from '@nestjs/mapped-types';
import { CreateRecadoDto } from './create-recado.dto';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UpdateRecadoDto extends PartialType(CreateRecadoDto) {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  readonly texto: string;
}
