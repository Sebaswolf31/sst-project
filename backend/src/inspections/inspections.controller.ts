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
} from '@nestjs/common';
import { InspectionService } from './inspections.service';
import { CreateInspectionDto } from './dto/create-inspection.dto';
import { Inspection } from './entities/inspection.entity';
import { FilterInspectionDto } from './dto/update-inspection.dto';
import { UpdateInspectionDto } from './dto/update-inspection.dto';

@Controller('inspections')
export class InspectionController {
  constructor(private readonly inspectionService: InspectionService) {}

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
}
