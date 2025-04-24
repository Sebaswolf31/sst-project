import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RiskService } from './risk.service';
import { CreateRiskDto } from './dto/create-risk.dto';
import { UpdateRiskDto } from './dto/update-risk.dto';

@Controller('risk')
export class RiskController {
  constructor(private readonly riskService: RiskService) {}

  @Post()
  create(@Body() createRiskDto: CreateRiskDto) {
    return this.riskService.create(createRiskDto);
  }

  @Get()
  findAll() {
    return this.riskService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.riskService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRiskDto: UpdateRiskDto) {
    return this.riskService.update(+id, updateRiskDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.riskService.remove(+id);
  }
}
