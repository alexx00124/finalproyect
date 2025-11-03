import { IsString, Length } from 'class-validator';

export class CreateAsignaturaDto {
  @IsString()
  @Length(2, 20)
  codigo!: string;

  @IsString()
  @Length(2, 100)
  nombre!: string;
}
