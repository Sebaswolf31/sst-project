// inspections/inspection-template.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseUUIDPipe,
  DefaultValuePipe,
  Query,
  ParseIntPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { InspectionTemplateService } from './inspection-template.service';
import { CreateInspectionTemplateDto } from './dto/inspection-template.dto';
import { InspectionTemplate } from './entities/inspection-template.entity';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('inspection-templates')
@UseGuards(AuthGuard, RolesGuard)
export class InspectionTemplateController {
  constructor(private readonly templateService: InspectionTemplateService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.INSPECTOR)
  async create(
    @Body() dto: CreateInspectionTemplateDto,
    @Req() req,
  ): Promise<InspectionTemplate> {
    return this.templateService.createTemplate(dto, req.user);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.INSPECTOR, UserRole.OPERATOR)
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req,
  ): Promise<InspectionTemplate> {
    return this.templateService.getTemplateById(id, req.user.companyId);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.INSPECTOR, UserRole.OPERATOR)
  async getAllTemplates(
    @Req() req,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<{ data: InspectionTemplate[]; total: number }> {
    return this.templateService.getAllTemplatesForCompany(req.user.companyId, {
      page,
      limit,
    });
  }
}
