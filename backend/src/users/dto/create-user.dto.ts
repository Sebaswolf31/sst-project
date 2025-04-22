import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
  Matches,
  MaxLength,
  Validate,
} from 'class-validator';
import { UserRole } from '../entities/user.entity';
import { MatchPassword } from '../../helpers/matchPassword';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  identification: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$^&*])/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
  })
  @MinLength(8)
  @MaxLength(15)
  password: string;

  @IsNotEmpty()
  @Validate(MatchPassword, ['password'])
  confirmPassword: string;

  @IsString()
  @Matches(/^\+?\d{7,15}$/, {
    message: 'Teléfono debe ser un número válido (ej: +573001234567)',
  })
  phone: string;

  @IsEnum(UserRole)
  role: UserRole;

  @IsNotEmpty()
  companyId: number; // ID de la empresa asignada
}
