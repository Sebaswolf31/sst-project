import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Risk } from './entities/risk.entity';
import { CreateRiskDto } from './dto/create-risk.dto';
import { UpdateRiskDto } from './dto/update-risk.dto';
 
@Injectable()
export class RiskService {
  constructor(@InjectRepository(Risk) private repo: Repository<Risk>) {}

  async create(dto: CreateRiskDto, companyId: string, createdById: string) {
    const e = this.repo.create({
      ...dto,
      companyId,
      createdById,
    });
    return this.repo.save(e);
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
