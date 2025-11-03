import { IsString, IsNotEmpty } from 'class-validator';

export class CreateEvaluacionDto {
  @IsString()
  @IsNotEmpty()
  titulo!: string;

  @IsString()
  @IsNotEmpty()
  contenido!: string; // JSON-string o Markdown

  @IsString()
  @IsNotEmpty()
  moduloId!: string;
}
