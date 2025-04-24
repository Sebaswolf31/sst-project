import { Injectable } from '@nestjs/common';
import { CreateInspectionDto } from './dto/create-inspection.dto';
import { UpdateInspectionDto } from './dto/update-inspection.dto';

@Injectable()
export class InspectionService {
  create(createInspectionDto: CreateInspectionDto) {
    return 'This action adds a new inspection';
  }

  findAll() {
    return `This action returns all inspection`;
  }

  findOne(id: number) {
    return `This action returns a #${id} inspection`;
  }

  update(id: number, updateInspectionDto: UpdateInspectionDto) {
    return `This action updates a #${id} inspection`;
  }

  remove(id: number) {
    return `This action removes a #${id} inspection`;
  }
}
