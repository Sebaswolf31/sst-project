// inspections/inspections.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inspection } from './entities/inspection.entity';
import { InspectionTemplate } from './entities/inspection-template.entity';
import { User } from '../users/entities/user.entity';
import { InspectionController } from './inspections.controller';
import { InspectionTemplateController } from './inspection-template.controller';
import { InspectionService } from './inspections.service';
import { InspectionTemplateService } from './inspection-template.service';
import { UsersModule } from 'src/users/users.module';
import { CommonModule } from '../common/common.module';
@Module({
  imports: [
    forwardRef(() => UsersModule),
    TypeOrmModule.forFeature([Inspection, InspectionTemplate, User]),
    CommonModule,
  ],
  controllers: [InspectionController, InspectionTemplateController],
  providers: [InspectionService, InspectionTemplateService],
})
export class InspectionsModule {}
