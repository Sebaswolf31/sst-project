// inspection-template.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateInspectionTemplateDto } from './dto/inspection-template.dto';
import { InspectionTemplate } from './entities/inspection-template.entity';

@Injectable()
export class InspectionTemplateService {
  constructor(
    @InjectRepository(InspectionTemplate)
    private templateRepository: Repository<InspectionTemplate>,
  ) {}

  async createTemplate(
    dto: CreateInspectionTemplateDto,
  ): Promise<InspectionTemplate> {
    // Usar el constructor de la entidad
    const template = new InspectionTemplate({
      name: dto.name,
      fields: dto.fields.map((f) => ({
        fieldName: f.fieldName,
        displayName: f.displayName,
        type: f.type,
        required: f.required,
        options: f.options,
      })),
    });

    return this.templateRepository.save(template);
  }

  async getTemplateById(id: string): Promise<InspectionTemplate> {
    const template = await this.templateRepository.findOne({
      where: { id },
      // Forzar el tipo de retorno
      cache: false,
    });

    if (!template) {
      throw new NotFoundException(`Template con ID ${id} no encontrado`);
    }

    return template;
  }

  async getAllTemplates(pagination: {
    page: number;
    limit: number;
  }): Promise<{ data: InspectionTemplate[]; total: number }> {
    const [data, total] = await this.templateRepository.findAndCount({
      skip: (pagination.page - 1) * pagination.limit,
      take: pagination.limit,
      order: { createdAt: 'DESC' },
    });

    return { data, total };
  }
}
