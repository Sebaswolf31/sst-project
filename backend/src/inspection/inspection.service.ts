import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inspection } from './entities/inspection.entity';
import { CreateInspectionDto } from './dto/create-inspection.dto';
import { UpdateInspectionDto } from './dto/update-inspection.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class InspectionService {
  constructor(
    @InjectRepository(Inspection)
    private repo: Repository<Inspection>,
    private cloudinaryService: CloudinaryService,
  ) {}

  async create(
    dto: CreateInspectionDto,
    companyId: string,
    createdById: string,
    signatureFile?: Express.Multer.File,
    attachments?: Express.Multer.File[]
  ) {
    // Manejar valores nulos explícitos
    const signature = signatureFile 
      ? await this.cloudinaryService.uploadFile(signatureFile)
      : null;

    const attachmentsUrls = attachments
      ? await Promise.all(attachments.map(file => this.cloudinaryService.uploadFile(file)))
      : null;

    const inspection = this.repo.create({
      ...dto,
      companyId, // Asegúrate que esta propiedad existe en la entidad
      createdById,
      signature,
      attachments: attachmentsUrls
    });

    return this.repo.save(inspection);
  }

  async findAll(companyId: string) {
    return this.repo.find({ where: { companyId } });
  }

  async findOne(id: string, companyId: string) {
    const e = await this.repo.findOne({ where: { id, companyId } });
    if (!e) throw new NotFoundException(`Inspection ${id} not found`);
    return e;
  }

  async update(id: string, companyId: string, dto: UpdateInspectionDto) {
    const e = await this.findOne(id, companyId);
    Object.assign(e, dto);
    return this.repo.save(e);
  }

  async remove(id: string, companyId: string) {
    const e = await this.findOne(id, companyId);
    await this.repo.remove(e);
  }
}
