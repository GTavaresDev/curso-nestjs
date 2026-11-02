import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateRecadoDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  readonly texto: string;
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  readonly de: string;
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  readonly para: string;
}
