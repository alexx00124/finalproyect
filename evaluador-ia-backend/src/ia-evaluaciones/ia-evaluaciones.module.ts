import { Module } from '@nestjs/common';
import { IaEvaluacionesController } from './ia-evaluaciones.controller';
import { IaEvaluacionesService } from './ia-evaluaciones.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [IaEvaluacionesController],
  providers: [IaEvaluacionesService, PrismaService, JwtService],
})
export class IaEvaluacionesModule {}
