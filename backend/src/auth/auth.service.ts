import {
  Injectable,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { CreateUserDto, LoginUserDto } from '../users/dto/create-user.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt/dist';
import { User } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async createUser(user: CreateUserDto) {
    const { email, password, confirmPassword, ...userWithoutConfirmation } =
      user;

    const existingUser = await this.usersRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException(`El email ${email} ya está en uso`);
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await this.usersRepository.save({
      ...userWithoutConfirmation,
      email,
      password: hashPassword,
    });

    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  async singin(credentials: LoginUserDto) {
    const { email, password } = credentials;
    const existingUser = await this.usersRepository.findOne({
      where: { email },
    });
    if (!existingUser) {
      throw new BadRequestException('Error en las credenciales');
    }

    const passwordEqual = await bcrypt.compare(password, existingUser.password);
    if (!passwordEqual) {
      throw new BadRequestException('Error en las credenciales');
    }

    const userPayload = {
      id: existingUser.id,
      email: existingUser.email,
    };

    const token = this.jwtService.sign(userPayload);

    return {
      token,
      message: 'Ingreso exitoso',
    };
  }
}
