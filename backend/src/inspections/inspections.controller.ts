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
    dto.companyId = req.user.companyId; // 👈 aquí se la pasamos

    if (req.user.role === UserRole.INSPECTOR) {
      dto.inspectorId = req.user.id;
    } else if (!dto.inspectorId) {
      dto.inspectorId = req.user.id; // también puede ser admin/operator como creador
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
    @Req() req,
  ): Promise<{ data: Inspection[]; total: number }> {
    return this.inspectionService.findAll(
      filter,
      { page, limit },
      req.user.companyId,
    );
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.INSPECTOR)
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req,
  ): Promise<Inspection> {
    const inspection = await this.inspectionService.findOne(
      id,
      req.user.companyId,
    );

    // Si el usuario es inspector, solo puede ver sus inspecciones
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
    const inspection = await this.inspectionService.findOne(
      id,
      req.user.companyId,
    );
    if (
      req.user.role === UserRole.INSPECTOR &&
      inspection.inspectorId !== req.user.id
    ) {
      throw new ForbiddenException('No puedes actualizar esta inspección');
    }
    return this.inspectionService.update(
      id,
      updateInspectionDto,
      req.user.companyId,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(UserRole.ADMIN, UserRole.INSPECTOR)
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req,
  ): Promise<void> {
    const inspection = await this.inspectionService.findOne(
      id,
      req.user.companyId,
    );
    if (
      req.user.role === UserRole.INSPECTOR &&
      inspection.inspectorId !== req.user.id
    ) {
      throw new ForbiddenException('No puedes eliminar esta inspección');
    }
    return this.inspectionService.remove(id, req.user.companyId);
  }

  @Post(':id/attachment')
  @Roles(UserRole.ADMIN, UserRole.INSPECTOR, UserRole.OPERATOR)
  @UseInterceptors(FileInterceptor('file'))
  async uploadAttachment(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFile() file: Express.Multer.File,
    @Req() req,
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

      return this.inspectionService.updateAttachment(
        id,
        filePath,
        req.user.companyId,
      );
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
    @Req() req,
  ): Promise<Inspection> {
    const filePath = await this.fileUploadService.saveFile(file, 'inspections');
    return this.inspectionService.updateAttachment(
      id,
      filePath,
      req.user.companyId,
    );
  }

  // CONTROLLERS PARA LOS GRAFICOS DE INSPECCIONES

  @Get('reports/by-template')
  @Roles(UserRole.ADMIN, UserRole.INSPECTOR)
  async getReportByTemplate(@Req() req: any) {
    return this.inspectionService.countByTemplate(req.user.companyId);
  }

  @Get('reports/by-form-type')
  @Roles(UserRole.ADMIN, UserRole.INSPECTOR)
  async getReportByFormType(@Req() req: any) {
    return this.inspectionService.countByFormType(req.user.companyId);
  }

  @Get('reports/by-inspection-type')
  @Roles(UserRole.ADMIN, UserRole.INSPECTOR)
  async getReportByInspectionType(@Req() req: any) {
    return this.inspectionService.countByInspectionType(req.user.companyId);
  }

  @Get('reports/template-vs-inspection-type')
  @Roles(UserRole.ADMIN, UserRole.INSPECTOR)
  async getReportTemplateVsInspectionType(@Req() req: any) {
    return this.inspectionService.countByTemplateAndInspectionType(
      req.user.companyId,
    );
  }

  /** GET /inspections/reports/total */
  @Get('reports/total')
  @Roles(UserRole.ADMIN, UserRole.INSPECTOR)
  async getTotalInspections(@Req() req: any): Promise<{ total: number }> {
    const total = await this.inspectionService.countTotal(req.user.companyId);
    return { total };
  }
}
