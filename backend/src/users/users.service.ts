import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRole } from './entities/user.entity';
import { Company } from '../company/entities/company.entity'; 

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findAll(companyId?: string): Promise<User[]> {
    const query = this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.companies', 'company');

    if (companyId) {
      query.where('company.id = :companyId', { companyId });
    }

    return query.getMany();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['companies'],
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    return user;
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
    currentUser?: User, // Usuario autenticado
  ): Promise<User> {
    const user = await this.findOne(id);

    // Bloquear cambios de companyId para ADMIN
    //   if (currentUser?.role === UserRole.ADMIN) {
    //     if (
    //       updateUserDto.companyId &&
    //       updateUserDto.companyId !== user.companies[0]?.id
    //     ) {
    //       throw new ForbiddenException(
    //         'No puedes cambiar la empresa del usuario',
    //       );
    //     }
    //     // Eliminar companyId del DTO para evitar modificaciones
    //     delete updateUserDto.companyId;
    //   }

    //   return this.usersRepository.save({ ...user, ...updateUserDto });
    // }

    // Validar permisos (ejemplo para ADMIN)
    if (currentUser?.role === UserRole.ADMIN) {
      const userCompanies = user.companies.map((c) => c.id);
      const currentUserCompany = currentUser.companies[0]?.id;

      if (!userCompanies.includes(currentUserCompany)) {
        throw new ForbiddenException('No puedes modificar este usuario');
      }
    }

    // Actualizar empresas si vienen en el DTO
    if (updateUserDto.companyIds) {
      user.companies = updateUserDto.companyIds.map(
        (id) => ({ id }) as   Company,
      );
    }

    return this.usersRepository.save({ ...user, ...updateUserDto });
  }


  // async remove(id: string, currentUser?: User): Promise<void> {
  //   const user = await this.findOne(id);

  //   // Verificar permisos (si se pasa currentUser)
  //   if (
  //     currentUser?.role === UserRole.ADMIN &&
  //     user.companyId !== currentUser.companyId
  //   ) {
  //     throw new ForbiddenException(
  //       'No puedes eliminar usuarios de otra empresa',
  //     );
  //   }

  //   await this.usersRepository.remove(user);
  // }

  async remove(id: string, currentUser?: User): Promise<void> {
    const user = await this.findOne(id);

    // Verificar permisos (si se pasa currentUser)
    if (
      currentUser?.role === UserRole.ADMIN &&
      user.companies[0]?.id !== currentUser.companies[0]?.id
    ) {
      throw new ForbiddenException(
        'No puedes eliminar usuarios de otra empresa',
      );
    }

    await this.usersRepository.remove(user);
  }

  // Método para AuthService
  async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.usersRepository.findOne({
      where: { email },
      relations: ['companies'],
      select: ['id', 'email', 'password', 'role'],
    });
    return user ?? undefined;
  }






  // SERVICIO PARA EL CONSULTOR

   async addCompanyToConsultor(
    userId: string,
    companyId: string,
    currentUser?: User
  ): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['companies'],
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    if (user.role !== UserRole.CONSULTOR) {
      throw new BadRequestException('Solo los consultores pueden tener múltiples empresas');
    }

    // Validación para ADMIN
    if (currentUser?.role === UserRole.ADMIN) {
      const adminCompanyId = currentUser.companies[0]?.id;
      if (companyId !== adminCompanyId) {
        throw new ForbiddenException('No puedes asignar otras empresas');
      }
    }

    // Evitar duplicados
    const exists = user.companies.some(c => c.id === companyId);
    if (exists) {
      throw new ConflictException('El consultor ya tiene esta empresa');
    }

    user.companies.push({ id: companyId } as Company);
    return this.usersRepository.save(user);
  }
}
