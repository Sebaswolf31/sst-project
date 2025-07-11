// inspection-template.service.ts
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
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
    user: { id: string; companyId: string },
  ): Promise<InspectionTemplate> {
    // Crea la entidad pasando formType en el nivel superior, no dentro de fields
    const template = this.templateRepository.create({
      name: dto.name,
      fields: dto.fields.map((f) => ({
        fieldName: f.fieldName,
        displayName: f.displayName,
        type: f.type,
        required: f.required,
        options: f.options,
      })),
      formType: dto.formType, // ← aquí
      companyId: user.companyId,
      createdById: user.id,
    });

    return this.templateRepository.save(template);
  }
  async getTemplateById(
    id: string,
    companyId: string,
  ): Promise<InspectionTemplate> {
    const template = await this.templateRepository.findOne({
      where: { id, companyId },
    });
    if (!template) {
      throw new ForbiddenException('No puedes acceder a esta plantilla');
    }
    return template;
  }

  async getAllTemplatesForCompany(
    companyId: string,
    { page, limit }: { page: number; limit: number },
  ): Promise<{ data: InspectionTemplate[]; total: number }> {
    const [data, total] = await this.templateRepository.findAndCount({
      where: { companyId },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { data, total };
  }
}
