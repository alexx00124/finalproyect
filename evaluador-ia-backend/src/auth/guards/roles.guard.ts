import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!requiredRoles) return true;

    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) throw new ForbiddenException('No se proporcionó token');

    try {
      // 👇 AGREGAR el secret explícitamente
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET || 'mi_clave_secreta_super_segura',
      });
      
      const userRole = payload.rol;

      if (!requiredRoles.includes(userRole)) {
        throw new ForbiddenException('No tienes permisos para esta acción');
      }

      request.user = payload;
      return true;
    } catch (error) {
      console.error('Error verificando token:', error); // 👈 AGREGAR para debug
      throw new ForbiddenException('Token inválido o expirado');
    }
  }
}