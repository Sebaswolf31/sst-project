import { PartialType } from '@nestjs/mapped-types';
import { CreateInspectionDto } from './create-inspection.dto';
import { IsObject, IsOptional, IsDateString } from 'class-validator';


export class UpdateInspectionDto extends PartialType(CreateInspectionDto) {
  @IsOptional()
  @IsObject()
  dynamicFields?: Record<string, any>;
}

export class FilterInspectionDto {
  @IsOptional()
  title?: string;

  @IsOptional()
  @IsDateString()
  startDate?: Date;

  @IsOptional()
  @IsDateString()
  endDate?: Date;

  @IsOptional()
  inspectorId?: string;

  @IsOptional()
  templateId?: string;
}