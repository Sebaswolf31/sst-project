import {
  Controller,
  Post,
  Get,
  Param,
  Patch,
  Delete,
  Body,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { RiskService } from './risk.service';
import { CreateRiskDto } from './dto/create-risk.dto';
import { UpdateRiskDto } from './dto/update-risk.dto';
import { User } from '../users/entities/user.entity';
import { GetUser } from '../auth/decorators/get-user.decorator';

@Controller('risks')
@UseGuards(AuthGuard, RolesGuard)
export class RiskController {
  constructor(private readonly riskService: RiskService) {}
  @Post()
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  create(@GetUser() user: User, @Body() dto: CreateRiskDto) {
    if (!user.companyId) {
      throw new BadRequestException('Tu usuario no tiene companyId');
    }
    return this.riskService.create(dto, user.companyId, user.id);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  findAll(@GetUser() user: User) {
    if (!user.companyId) {
      throw new BadRequestException('Usuario sin companyId');
    }
    return this.riskService.findAll(user.companyId);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  findOne(@GetUser() user: User, @Param('id') id: string) {
    if (!user.companyId) {
      throw new BadRequestException('Usuario sin companyId');
    }
    return this.riskService.findOne(id, user.companyId);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  update(
    @GetUser() user: User,
    @Param('id') id: string,
    @Body() dto: UpdateRiskDto,
  ) {
    if (!user.companyId) {
      throw new BadRequestException('Usuario sin companyId');
    }
    return this.riskService.update(id, user.companyId, dto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@GetUser() user: User, @Param('id') id: string) {
    if (!user.companyId) {
      throw new BadRequestException('Usuario sin companyId');
    }
    return this.riskService.remove(id, user.companyId);
  }
}
