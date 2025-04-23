// src/auth/guards/roles.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../../users/entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<UserRole[]>(
      'roles',
      context.getHandler(),
    );

    // Si no hay roles requeridos, permitir acceso
    if (!requiredRoles) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('Usuario no autenticado');
    }

    // SUPERADMIN tiene acceso total
    if (user.role === UserRole.SUPERADMIN) return true;

    // Verificar si el rol del usuario está permitido
    const hasRole = requiredRoles.some((role) => user.role === role);

    // ADMIN y OPERATOR deben pertenecer a una empresa
    if (!hasRole || (user.role !== UserRole.SUPERADMIN && !user.companyId)) {
      throw new UnauthorizedException('No tienes permisos para esta acción');
    }

    return true;
  }
}
