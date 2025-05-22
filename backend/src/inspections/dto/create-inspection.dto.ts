// inspections/dto/create-inspection.dto.ts
import { IsNotEmpty, IsISO8601, IsUUID, IsObject } from 'class-validator';

export class CreateInspectionDto {
  @IsNotEmpty()
  title: string;

  @IsISO8601()
  date: Date;

  @IsUUID()
  inspectorId: string;

  @IsUUID()
  templateId: string;

  @IsObject()
  dynamicFields: Record<string, any>;
}
