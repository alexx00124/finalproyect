import { IsString, Length } from 'class-validator';

export class CreateModuloDto {
  @IsString()
  @Length(2, 100)
  nombre!: string;

  @IsString()
  asignaturaId!: string;
}
