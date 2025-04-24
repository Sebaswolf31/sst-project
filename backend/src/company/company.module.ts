// src/company/company.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { Company } from './entities/company.entity';
import { UsersModule } from '../users/users.module';
import { Risk } from 'src/risk/entities/risk.entity';
import { Inspection } from 'src/inspection/entities/inspection.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Company]),
    forwardRef(() => UsersModule), // Necesario para relaciones
    Risk,
    Inspection,
    Document,
  ],
  controllers: [CompanyController],
  providers: [CompanyService],
  exports: [CompanyService], // Para usar en otros módulos
})
export class CompanyModule {}
