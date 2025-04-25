import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentService } from './document.service';
import { DocumentController } from './document.controller';
import { Document } from './entities/document.entity';
import { Company } from 'src/company/entities/company.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Document, Company, User])],
  controllers: [DocumentController],
  providers: [DocumentService],
  exports: [DocumentService], // Para usar en otros módulos
})
export class DocumentModule {}
