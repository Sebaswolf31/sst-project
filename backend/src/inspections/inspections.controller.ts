// inspections/inspection.controller.ts
import {
  Body,
  Controller,
  Post,
  Get,
  Patch,
  Param,
  ParseUUIDPipe,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  BadRequestException,
  UploadedFile,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { InspectionService } from './inspections.service';
import { CreateInspectionDto } from './dto/create-inspection.dto';
import { Inspection } from './entities/inspection.entity';
import { FilterInspectionDto } from './dto/update-inspection.dto';
import { UpdateInspectionDto } from './dto/update-inspection.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from '../common/file-upload.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('inspections')
@UseGuards(AuthGuard, RolesGuard)
export class InspectionController {
  constructor(
    private readonly inspectionService: InspectionService,
    private readonly fileUploadService: FileUploadService,
  ) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.INSPECTOR, UserRole.OPERATOR)
  async create(
    @Body() dto: CreateInspectionDto,
    @Req() req: any,
  ): Promise<Inspection> {
    if (req.user.role === UserRole.INSPECTOR) {
      dto.inspectorId = req.user.id;
    }
    return this.inspectionService.createInspection(dto);
  }

  @Get('inspector/:inspectorId')
  @Roles(UserRole.ADMIN, UserRole.INSPECTOR, UserRole.OPERATOR)
  async getByInspector(
    @Param('inspectorId', ParseUUIDPipe) inspectorId: string,
    @Req() req,
  ): Promise<Inspection[]> {
    if (req.user.role !== UserRole.OPERATOR || req.user.id !== inspectorId) {
      throw new ForbiddenException(
        'No puedes ver inspecciones de otro usuario',
      );
    }
    return this.inspectionService.getInspectionsByInspector(inspectorId);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.INSPECTOR)
  async findAll(
    @Query() filter: FilterInspectionDto,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<{ data: Inspection[]; total: number }> {
    return this.inspectionService.findAll(filter, { page, limit });
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.INSPECTOR)
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: any,
  ): Promise<Inspection> {
    const inspection = await this.inspectionService.findOne(id);
    if (
      req.user.role === UserRole.INSPECTOR &&
      inspection.inspectorId !== req.user.id
    ) {
      throw new ForbiddenException('No puedes ver esta inspección');
    }
    return inspection;
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.INSPECTOR)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateInspectionDto: UpdateInspectionDto,
    @Req() req,
  ): Promise<Inspection> {
    const inspection = await this.inspectionService.findOne(id);
    if (
      req.user.role === UserRole.INSPECTOR &&
      inspection.inspectorId !== req.user.id
    ) {
      throw new ForbiddenException('No puedes actualizar esta inspección');
    }
    return this.inspectionService.update(id, updateInspectionDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(UserRole.ADMIN, UserRole.INSPECTOR)
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req,
  ): Promise<void> {
    const inspection = await this.inspectionService.findOne(id);
    if (
      req.user.role === UserRole.INSPECTOR &&
      inspection.inspectorId !== req.user.id
    ) {
      throw new ForbiddenException('No puedes eliminar esta inspección');
    }
    return this.inspectionService.remove(id);
  }

  @Post(':id/attachment')
  @Roles(UserRole.ADMIN, UserRole.INSPECTOR, UserRole.OPERATOR)
  @UseInterceptors(FileInterceptor('file'))
  async uploadAttachment(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No se ha subido ningún archivo');
    }

    try {
      const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      const filePath = await this.fileUploadService.saveFile(
        file,
        'inspections',
        allowedTypes,
      );

      return this.inspectionService.updateAttachment(id, filePath);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Patch(':id/attachment')
  @Roles(UserRole.ADMIN, UserRole.INSPECTOR, UserRole.OPERATOR)
  @UseInterceptors(FileInterceptor('file'))
  async updateAttachment(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Inspection> {
    const filePath = await this.fileUploadService.saveFile(file, 'inspections');
    return this.inspectionService.updateAttachment(id, filePath);
  }

  // CONTROLLERS PARA LOS GRAFICOS DE INSPECCIONES

  @Get('reports/by-template')
  @Roles(UserRole.ADMIN, UserRole.INSPECTOR)
  async getReportByTemplate() {
    return this.inspectionService.countByTemplate();
  }

  @Get('reports/by-form-type')
  @Roles(UserRole.ADMIN, UserRole.INSPECTOR)
  async getReportByFormType() {
    return this.inspectionService.countByFormType();
  }

  @Get('reports/by-inspection-type')
  @Roles(UserRole.ADMIN, UserRole.INSPECTOR)
  async getReportByInspectionType() {
    return this.inspectionService.countByInspectionType();
  }

  @Get('reports/template-vs-inspection-type')
  @Roles(UserRole.ADMIN, UserRole.INSPECTOR)
  async getReportTemplateVsInspectionType() {
    return this.inspectionService.countByTemplateAndInspectionType();
  }

  /** GET /inspections/reports/total */
  @Get('reports/total')
  @Roles(UserRole.ADMIN, UserRole.INSPECTOR)
  async getTotalInspections(): Promise<{ total: number }> {
    const total = await this.inspectionService.countTotal();
    return { total };
  }
}
