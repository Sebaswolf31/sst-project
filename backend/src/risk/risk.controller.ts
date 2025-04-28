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
  UseInterceptors,
  UploadedFiles,
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
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@Controller('risks')
@UseGuards(AuthGuard, RolesGuard)
export class RiskController {
  constructor(private readonly riskService: RiskService) {}
  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'attachments', maxCount: 5 }, // Permitir hasta 5 archivos
    ]),
  )
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  async create(
    @GetUser() user: User,
    @Body() dto: CreateRiskDto,
    @UploadedFiles() files: { attachments?: Express.Multer.File[] },
  ) {
    if (!user.companyId) {
      throw new BadRequestException(
        'Tu usuario no tiene companyId, el companyId es requerido',
      );
    }
    return this.riskService.create(
      dto,
      user.companyId,
      user.id,
      files?.attachments,
    );
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
