import { IsUUID, IsString } from 'class-validator';

export class AddCompanyDto {
  @IsUUID()
  @IsString()
  companyId: string;
}
