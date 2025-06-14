// inspections/dto/inspection-template.dto.ts
import { IsNotEmpty, IsArray, ValidateNested, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { FormType } from '../enums/form-type.enum';

class DynamicFieldDefinitionDto {
  @IsNotEmpty()
  fieldName: string;

  @IsNotEmpty()
  displayName: string;

  @IsNotEmpty()
  type: 'text' | 'number' | 'checkbox' | 'date' | 'dropdown';

  @IsNotEmpty()
  required: boolean;

  options?: string[];
}

export class CreateInspectionTemplateDto {
  @IsNotEmpty()
  name: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DynamicFieldDefinitionDto)
  fields: DynamicFieldDefinitionDto[];

  @IsEnum(FormType)
  formType: FormType;
}
