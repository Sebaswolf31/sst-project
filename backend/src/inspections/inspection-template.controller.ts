// inspections/inspection-template.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { InspectionTemplateService } from './inspection-template.service';
import { CreateInspectionTemplateDto } from './dto/inspection-template.dto';
import { InspectionTemplate } from './entities/inspection-template.entity';

@Controller('inspection-templates')
export class InspectionTemplateController {
  constructor(private readonly templateService: InspectionTemplateService) {}

  @Post()
  create(
    @Body() dto: CreateInspectionTemplateDto,
  ): Promise<InspectionTemplate> {
    return this.templateService.createTemplate(dto);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<InspectionTemplate> {
    return this.templateService.getTemplateById(id);
  }
}
