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
  HttpCode,
  HttpStatus,
  UseInterceptors,
  BadRequestException,
  UploadedFile,
} from '@nestjs/common';
import { InspectionService } from './inspections.service';
import { CreateInspectionDto } from './dto/create-inspection.dto';
import { Inspection } from './entities/inspection.entity';
import { FilterInspectionDto } from './dto/update-inspection.dto';
import { UpdateInspectionDto } from './dto/update-inspection.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from '../common/file-upload.service';

@Controller('inspections')
export class InspectionController {
  constructor(
    private readonly inspectionService: InspectionService,
    private readonly fileUploadService: FileUploadService,
  ) {}

  @Post()
  create(@Body() dto: CreateInspectionDto): Promise<Inspection> {
    return this.inspectionService.createInspection(dto);
  }

  @Get('inspector/:inspectorId')
  getByInspector(
    @Param('inspectorId', ParseUUIDPipe) inspectorId: string,
  ): Promise<Inspection[]> {
    return this.inspectionService.getInspectionsByInspector(inspectorId);
  }

  @Get()
  async findAll(
    @Query() filter: FilterInspectionDto,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<{ data: Inspection[]; total: number }> {
    return this.inspectionService.findAll(filter, { page, limit });
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Inspection> {
    return this.inspectionService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateInspectionDto: UpdateInspectionDto,
  ): Promise<Inspection> {
    return this.inspectionService.update(id, updateInspectionDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.inspectionService.remove(id);
  }

  @Post(':id/attachment')
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
  getReportByTemplate() {
    return this.inspectionService.countByTemplate();
  }

  @Get('reports/by-form-type')
  getReportByFormType() {
    return this.inspectionService.countByFormType();
  }

  @Get('reports/by-inspection-type')
  getReportByInspectionType() {
    return this.inspectionService.countByInspectionType();
  }

  @Get('reports/template-vs-inspection-type')
  getReportTemplateVsInspectionType() {
    return this.inspectionService.countByTemplateAndInspectionType();
  }
}
