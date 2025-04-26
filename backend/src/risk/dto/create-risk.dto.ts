import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateRiskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsUUID()
  companyId: string;
}
