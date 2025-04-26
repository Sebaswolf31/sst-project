import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inspection } from './entities/inspection.entity';
import { CreateInspectionDto } from './dto/create-inspection.dto';
import { UpdateInspectionDto } from './dto/update-inspection.dto';

@Injectable()
export class InspectionService {
  constructor(
    @InjectRepository(Inspection)
    private repo: Repository<Inspection>,
  ) {}

  async create(dto: CreateInspectionDto, companyId: string, createdById: string) {
    const e = this.repo.create({ ...dto, companyId, createdById });
    return this.repo.save(e);
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
