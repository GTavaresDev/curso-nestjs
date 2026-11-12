import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateRecadoDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  readonly texto: string;

  @Type(() => Number)
  @IsInt()
  @IsPositive()
  readonly para: number; // ID do usuário que recebe

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  readonly fotos?: string[];
}
