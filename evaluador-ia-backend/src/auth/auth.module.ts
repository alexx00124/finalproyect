import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from '../prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config'; // ✅ Para leer variables del .env

@Module({
  imports: [
    ConfigModule.forRoot(), // ✅ Carga las variables del .env
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'mi_clave_secreta_super_segura',
      signOptions: { expiresIn: (process.env.JWT_EXPIRATION as unknown as number) || '7d' },
      // 👆 Convertimos a tipo compatible con JwtSignOptions
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, PrismaService],
})
export class AuthModule {}
