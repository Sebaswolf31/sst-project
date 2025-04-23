import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { UserRole } from 'src/users/entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<UserRole[]>(
      'roles',
      context.getHandler(),
    );

    if (!requiredRoles) return true;

    const { user } = context.switchToHttp().getRequest();

    // SUPERADMIN tiene acceso total
    if (user.role === UserRole.SUPERADMIN) return true;

    // ADMIN y OPERATOR deben pertenecer a una empresa
    if (!user.companyId) return false;

    return requiredRoles.includes(user.role);
  }
}
