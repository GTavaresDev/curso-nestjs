import {
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateRecadoDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  readonly texto: string;

  @IsInt()
  @IsPositive()
  readonly para: number; // ID do usuário que recebe
}
