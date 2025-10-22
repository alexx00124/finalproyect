/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  /**
   * Registra un nuevo usuario en la base de datos.
   */
  async register(
    email: string,
    password: string,
    nombre: string,
  ): Promise<{ message: string; user: { id: string; email: string } }> {
    const existing = await this.prisma.usuario.findUnique({
      where: { email },
    });

    if (existing) throw new ConflictException('El email ya está registrado.');

    const hashed = await bcrypt.hash(password, 10);

    const user = await this.prisma.usuario.create({
      data: { email, password: hashed, nombre },
    });

    return {
      message: 'Usuario registrado con éxito',
      user: { id: user.id, email: user.email },
    };
  }

  /**
   * Autentica un usuario y genera un token de acceso.
   */
  async login(
    email: string,
    password: string,
  ): Promise<{ access_token: string; user: { id: string; email: string; nombre: string } }> {
    const user = await this.prisma.usuario.findUnique({
      where: { email },
    });

    if (!user) throw new UnauthorizedException('Credenciales inválidas.');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new UnauthorizedException('Credenciales inválidas.');

    const token = await this.jwt.signAsync({
      sub: user.id,
      email: user.email,
    });

    return {
      access_token: token,
      user: { id: user.id, email: user.email, nombre: user.nombre },
    };
  }
}
