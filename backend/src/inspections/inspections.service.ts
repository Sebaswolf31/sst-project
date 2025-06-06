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
import { FilterInspectionDto } from './dto/update-inspection.dto';
import { UpdateInspectionDto } from './dto/update-inspection.dto';
import {  InspectionType } from './entities/inspection.entity';
import { FileUploadService } from '../common/file-upload.service';
import { FormType } from './enums/form-type.enum';

@Injectable()
export class InspectionService {
  constructor(
    @InjectRepository(Inspection)
    private inspectionRepository: Repository<Inspection>,
    @InjectRepository(InspectionTemplate)
    private templateRepository: Repository<InspectionTemplate>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly fileUploadService: FileUploadService,
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

    // Añadir validación para los nuevos campos

    if (!Object.values(InspectionType).includes(dto.inspectionType)) {
      throw new BadRequestException('Tipo de inspección inválido');
    }

    this.validateDynamicFields(dto.dynamicFields, template.fields);

    return this.inspectionRepository.save({
      ...dto,
      formType: template.formType, // Heredar de la plantilla
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

  async findAll(
    filter: FilterInspectionDto,
    pagination: { page: number; limit: number },
  ): Promise<{ data: Inspection[]; total: number }> {
    const query = this.inspectionRepository
      .createQueryBuilder('inspection')
      .leftJoinAndSelect('inspection.inspector', 'inspector')
      .leftJoinAndSelect('inspection.template', 'template');

    // Aplicar filtros
    if (filter.title) {
      query.andWhere('LOWER(inspection.title) LIKE :title', {
        title: `%${filter.title.toLowerCase()}%`,
      });
    }

    if (filter.startDate && filter.endDate) {
      query.andWhere('inspection.date BETWEEN :start AND :end', {
        start: filter.startDate,
        end: filter.endDate,
      });
    }

    // Paginación
    const [data, total] = await query
      .skip((pagination.page - 1) * pagination.limit)
      .take(pagination.limit)
      .getManyAndCount();

    return { data, total };
  }

  async findOne(id: string): Promise<Inspection> {
    const inspection = await this.inspectionRepository.findOne({
      where: { id },
      relations: ['inspector', 'template'],
    });

    if (!inspection) {
      throw new NotFoundException('Inspección no encontrada');
    }

    return inspection;
  }

  async update(id: string, dto: UpdateInspectionDto): Promise<Inspection> {
    const inspection = await this.findOne(id);

    // Validar plantilla si se actualiza
    if (dto.templateId) {
      const template = await this.templateRepository.findOneBy({
        id: dto.templateId,
      });

      if (!template) {
        throw new NotFoundException('Plantilla no encontrada');
      }

      inspection.template = template;
    }

    // Validar campos dinámicos
    if (dto.dynamicFields) {
      this.validateDynamicFields(dto.dynamicFields, inspection.template.fields);
    }

    // Actualizar campos
    return this.inspectionRepository.save({
      ...inspection,
      ...dto,
    });
  }

  async remove(id: string): Promise<void> {
    const result = await this.inspectionRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException('Inspección no encontrada');
    }
  }

  async updateAttachment(id: string, filePath: string): Promise<Inspection> {
    const inspection = await this.findOne(id);

    // Eliminar archivo anterior si existe
    if (inspection.attachment) {
      await this.fileUploadService.deleteFile(inspection.attachment);
    }

    inspection.attachment = filePath;
    return this.inspectionRepository.save(inspection);
  }

  
}
