import { IsUUID, IsDateString, IsEnum, IsString } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateInspectionDto } from './create-inspection.dto';

export class UpdateInspectionDto extends PartialType(CreateInspectionDto) {
  @IsDateString()
  date?: string;

  @IsString()
  description?: string;
}
