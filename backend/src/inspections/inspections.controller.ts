// inspections/inspection.controller.ts
import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { InspectionService } from './inspections.service';
import { CreateInspectionDto } from './dto/create-inspection.dto';
import { Inspection } from './entities/inspection.entity';

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
}
