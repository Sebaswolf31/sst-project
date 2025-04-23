import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
  Matches,
  MaxLength,
  Validate,
  IsOptional,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { UserRole } from '../entities/user.entity';
import { CreateUserDto } from './create-user.dto';
import { MatchPassword } from '../../helpers/matchPassword';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  identification: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$^&*])/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
  })
  @MinLength(8)
  @MaxLength(15)
  password: string;

  @IsOptional()
  @IsNotEmpty()
  @Validate(MatchPassword, ['password'])
  confirmPassword: string;

  @IsOptional()
  @IsString()
  @Matches(/^\+?\d{7,15}$/, {
    message: 'Teléfono debe ser un número válido (ej: +573001234567)',
  })
  phone: string;

  @IsOptional()
  @IsEnum(UserRole)
  role: UserRole;

  @IsOptional()
  @IsNotEmpty()
  companyId: string; // ID de la empresa asignada
}
