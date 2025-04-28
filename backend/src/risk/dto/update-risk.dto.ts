import { IsString } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateRiskDto } from './create-risk.dto';

export class UpdateRiskDto extends PartialType(CreateRiskDto) {
  @IsString()
  title?: string;

  @IsString()
  description?: string;
}
