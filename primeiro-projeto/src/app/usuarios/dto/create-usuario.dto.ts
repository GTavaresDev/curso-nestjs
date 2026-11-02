import { IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';

export class CreateUsuarioDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  readonly passwordHash: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  readonly name: string;
}
