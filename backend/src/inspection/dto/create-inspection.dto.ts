import { IsUUID, IsDateString, IsEnum, IsString } from 'class-validator';

import { InspectionType } from '../entities/inspection.entity';

export class CreateInspectionDto {
  @IsUUID()
  riskId: string;

  @IsEnum(InspectionType)
  type: InspectionType;

  @IsDateString()
  date: string;

  @IsString()
  description: string;
}

