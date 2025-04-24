import { IsUUID, IsString, IsNotEmpty } from 'class-validator';

export class CreateDocumentDto {
  @IsString()
  @IsNotEmpty()
  filename: string;

  @IsString()
  @IsNotEmpty()
  path: string;

  @IsUUID()
  companyId: string;
}
