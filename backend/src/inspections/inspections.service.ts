// inspections/inspection.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inspection } from './entities/inspection.entity';
import { InspectionTemplate } from './entities/inspection-template.entity';
import { User } from '../users/entities/user.entity';
import { CreateInspectionDto } from './dto/create-inspection.dto';
import { DynamicFieldDefinition } from './entities/inspection-template.entity';
import { UserRole } from '../users/entities/user.entity';

@Injectable()
export class InspectionService {
  constructor(
    @InjectRepository(Inspection)
    private inspectionRepository: Repository<Inspection>,
    @InjectRepository(InspectionTemplate)
    private templateRepository: Repository<InspectionTemplate>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createInspection(dto: CreateInspectionDto): Promise<Inspection> {
    const [inspector, template] = await Promise.all([
      this.userRepository.findOne({
        where: { id: dto.inspectorId },
        select: ['id', 'role'],
      }),
      this.templateRepository.findOne({
        where: { id: dto.templateId },
      }),
    ]);

    if (!inspector) throw new NotFoundException('Inspector no encontrado');
    if (!template) throw new NotFoundException('Plantilla no encontrada');

    if (inspector.role !== UserRole.INSPECTOR) {
      throw new BadRequestException(
        'Solo usuarios con rol inspector pueden crear inspecciones',
      );
    }

    this.validateDynamicFields(dto.dynamicFields, template.fields);

    return this.inspectionRepository.save({
      ...dto,
      inspector: { id: dto.inspectorId },
      template: { id: dto.templateId },
    });
  }

  private validateDynamicFields(
    data: Record<string, any>,
    fields: DynamicFieldDefinition[],
  ): void {
    fields.forEach((field) => {
      const value = data[field.fieldName];

      if (field.required && (value === undefined || value === null)) {
        throw new BadRequestException(`${field.displayName} es requerido`);
      }

      if (value !== undefined && value !== null) {
        switch (field.type) {
          case 'number':
            if (isNaN(Number(value))) {
              throw new BadRequestException(
                `${field.displayName} debe ser numérico`,
              );
            }
            break;
          case 'date':
            if (isNaN(Date.parse(value))) {
              throw new BadRequestException(
                `${field.displayName} debe ser una fecha válida`,
              );
            }
            break;
          case 'dropdown':
            if (field.options && !field.options.includes(value)) {
              throw new BadRequestException(
                `${field.displayName} tiene un valor inválido`,
              );
            }
            break;
        }
      }
    });
  }

  async getInspectionsByInspector(inspectorId: string): Promise<Inspection[]> {
    return this.inspectionRepository.find({
      where: { inspectorId },
      relations: ['template'],
    });
  }
}
