import {
  Controller,
  Get,
  Param,
  Patch,
  Delete,
  UseGuards,
  Query,
  Body,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
@UseGuards(AuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get()
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
  findAll(
    @Query('companyId') companyId: string,
    @Req() req, // Acceder al usuario autenticado
  ) {
    const user = req.user;

    // ADMIN solo puede ver su propia empresa
    if (user.role === UserRole.ADMIN) {
      companyId = user.companyId;
    } else {
      // SUPERADMIN puede filtrar por companyId (si lo envía)
      companyId = req.query.companyId;
    }

    return this.usersService.findAll(companyId);
  }

  @Get(':id')
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req, // Acceder al usuario autenticado
  ) {
    const currentUser = req.user;
    const targetUser = await this.usersService.findOne(id);

    // Si es ADMIN, verificar que el usuario objetivo sea de su empresa
    if (currentUser.role === UserRole.ADMIN) {
      if (targetUser.companyId !== currentUser.companyId) {
        throw new ForbiddenException('No puedes modificar usuarios de otra empresa');
      }
    }

    return this.usersService.update(id, updateUserDto, currentUser);
  }

  @Delete(':id')
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
  async remove(
    @Param('id') id: string,
    @Req() req,
  ) {
    const currentUser = req.user;
    const targetUser = await this.usersService.findOne(id);

    // Si es ADMIN, verificar que el usuario objetivo sea de su empresa
    if (currentUser.role === UserRole.ADMIN) {
      if (targetUser.companyId !== currentUser.companyId) {
        throw new ForbiddenException('No puedes eliminar usuarios de otra empresa');
      }
    }

    return this.usersService.remove(id, currentUser);
  }

}