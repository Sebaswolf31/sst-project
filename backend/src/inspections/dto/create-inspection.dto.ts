import {
  IsNotEmpty,
  IsISO8601,
  IsUUID,
  IsObject,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { InspectionType } from '../entities/inspection.entity'; // Importa los enums
import { FormType } from '../enums/form-type.enum';

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

  // Nuevos campos

  @IsEnum(FormType)
  formType: FormType;

  @IsEnum(InspectionType)
  inspectionType: InspectionType;

  @IsOptional()
  @IsString()
  attachment?: string; // Almacenará la ruta del archivo
}
