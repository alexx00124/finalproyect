import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { File } from 'multer';
import { IaEvaluacionesService } from './ia-evaluaciones.service';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { EvaluacionGenerada } from './interfaces/evaluacion.interface';

@Controller('ia-evaluaciones')
@UseGuards(RolesGuard)
export class IaEvaluacionesController {
  constructor(private readonly iaService: IaEvaluacionesService) {}

  @Post('generar')
  @Roles('docente')
  @UseInterceptors(
    FileInterceptor('pdf', {
      storage: memoryStorage(),
      limits: { fileSize: 10 * 1024 * 1024 },
      fileFilter: (req, file, cb) => {
        if (file.mimetype !== 'application/pdf') {
          return cb(new BadRequestException('Solo se permiten archivos PDF'), false);
        }
        cb(null, true);
      },
    }),
  )
  async generarEvaluacion(
    @UploadedFile() file: File,
    @Body('moduloId') moduloId: string,
  ): Promise<{ message: string; data: EvaluacionGenerada }> {
    console.log('📄 Archivo recibido:', {
      filename: file?.originalname,
      mimetype: file?.mimetype,
      size: file?.size,
      hasBuffer: !!file?.buffer,
    });

    if (!file) {
      throw new BadRequestException('Debes subir un archivo PDF');
    }

    if (!file.buffer) {
      throw new BadRequestException('El archivo no se recibió correctamente');
    }

    if (!moduloId) {
      throw new BadRequestException('Debes especificar un moduloId');
    }

    try {
      const evaluacionGenerada = await this.iaService.generarEvaluacion(file.buffer, moduloId);
      return {
        message: 'Evaluación generada exitosamente',
        data: evaluacionGenerada,
      };
    } catch (error) {
      console.error('❌ Error al generar evaluación:', error);
      throw error;
    }
  }
}
