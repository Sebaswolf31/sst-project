import {
  Injectable,
  BadRequestException,
  ConflictException,
  UnauthorizedException,
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
    const { email, password, confirmPassword, companyId, ...rest } = user;

    const existingUser = await this.usersRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException(`El email ${email} ya está en uso`);
    }

    // aca validamos la identificacion del usuario

    const hashPassword = await bcrypt.hash(password, 10);
    const userEntity = this.usersRepository.create({
      ...rest,
      email,
      password: hashPassword,
      companyId,
    });

    const saved = await this.usersRepository.save(userEntity);
    const { password: _, ...userWithoutPassword } = saved;
    return userWithoutPassword;
  }

  async singin(credentials: LoginUserDto) {
    const user = await this.usersRepository.findOne({
      where: { email: credentials.email },
      relations: ['company'], // Asegurar carga de relación cuando exista
    });

    if (!user || !(await bcrypt.compare(credentials.password, user.password))) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Payload con datos esenciales para permisos
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      companyId: user.company?.id || null, // Asegurar companyId
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        companyId: user.company?.id,
      },
    };
  }
}
