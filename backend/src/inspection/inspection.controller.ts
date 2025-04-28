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
import { InspectionService } from './inspection.service';
import { CreateInspectionDto } from './dto/create-inspection.dto';
import { UpdateInspectionDto } from './dto/update-inspection.dto';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../users/entities/user.entity';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@Controller('inspections')
@UseGuards(AuthGuard, RolesGuard)
export class InspectionController {
  constructor(private readonly inspectionService: InspectionService) {}

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'signature', maxCount: 1 },
      { name: 'attachments', maxCount: 5 },
    ]),
  )
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  async create(
    @GetUser() user: User,
    @Body() dto: CreateInspectionDto,
    @UploadedFiles()
    files: {
      signature?: Express.Multer.File[];
      attachments?: Express.Multer.File[];
    },
  ) {
    if (!user.companyId) {
      throw new BadRequestException('Tu usuario no tiene companyId');
    }
    return this.inspectionService.create(
      dto,
      user.companyId,
      user.id,
      files?.signature?.[0],
      files?.attachments,
    );
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  findAll(@GetUser() user: User) {
    if (!user.companyId) {
      throw new BadRequestException('Tu usuario no tiene companyId');
    }
    return this.inspectionService.findAll(user.companyId);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  findOne(@GetUser() user: User, @Param('id') id: string) {
    if (!user.companyId) {
      throw new BadRequestException('Tu usuario no tiene companyId');
    }
    return this.inspectionService.findOne(id, user.companyId);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  update(
    @GetUser() user: User,
    @Param('id') id: string,
    @Body() dto: UpdateInspectionDto,
  ) {
    if (!user.companyId) {
      throw new BadRequestException('Tu usuario no tiene companyId');
    }
    return this.inspectionService.update(id, user.companyId, dto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@GetUser() user: User, @Param('id') id: string) {
    if (!user.companyId) {
      throw new BadRequestException('Tu usuario no tiene companyId');
    }
    return this.inspectionService.remove(id, user.companyId);
  }
}
