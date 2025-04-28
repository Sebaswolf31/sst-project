import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsEnum,
  IsNumber,
  Min,
  Max,
} from 'class-validator';

import { RiskCategory, RiskImpact } from '../entities/risk.entity';

// create-risk.dto.ts
export class CreateRiskDto {
  @IsEnum(RiskCategory)
  category: RiskCategory;

  @IsEnum(RiskImpact)
  impact: RiskImpact;

  @IsNumber()
  @Min(0)
  @Max(1)
  probability: number;

  @IsString()
  title: string;

  @IsString()
  description: string;
}
