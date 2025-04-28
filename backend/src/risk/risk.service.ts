import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Risk } from './entities/risk.entity';
import { CreateRiskDto } from './dto/create-risk.dto';
import { UpdateRiskDto } from './dto/update-risk.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class RiskService {
  constructor(
    @InjectRepository(Risk) private repo: Repository<Risk>,
    private cloudinaryService: CloudinaryService,
  ) {}

  async create(
    dto: CreateRiskDto,
    companyId: string,
    createdById: string,
    files?: Express.Multer.File[],
  ) {
    const attachments = files
      ? await Promise.all(
          files.map((file) =>
            this.cloudinaryService.uploadFile(
              file,
              `companies/${companyId}/risks`,
            ),
          ),
        )
      : [];

    return this.repo.save({
      ...dto,
      companyId,
      createdById,
      attachments,
    });
  }

  async findAll(companyId: string) {
    return this.repo.find({ where: { companyId } });
  }

  async findOne(id: string, companyId: string) {
    const e = await this.repo.findOne({ where: { id, companyId } });
    if (!e) throw new NotFoundException();
    return e;
  }

  async update(id: string, companyId: string, dto: UpdateRiskDto) {
    const e = await this.findOne(id, companyId);
    Object.assign(e, dto);
    return this.repo.save(e);
  }

  async remove(id: string, companyId: string) {
    const e = await this.findOne(id, companyId);
    await this.repo.remove(e);
  }
}
