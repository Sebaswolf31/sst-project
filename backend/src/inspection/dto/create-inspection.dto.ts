import { IsUUID, IsDateString } from 'class-validator';

export class CreateInspectionDto {
  @IsUUID()
  riskId: string;

  @IsDateString()
  date: string;

  @IsUUID()
  companyId: string;
}
