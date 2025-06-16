import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CctvSchedulesService } from './cctv-schedules.service';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard, RolesGuard } from 'src/common/guards';
import { Role } from 'src/common/enums';
import { Roles } from 'src/common/decorators';
import { CreateCctvScheduleDto } from 'src/common/dto';
import { UpdateCctvScheduleDto } from 'src/common/dto/data/update-cctv-schedule.dto';

@ApiTags('CCTV Schedules')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Admin)
@Controller('cctv-schedules')
export class CctvSchedulesController {
  constructor(private readonly cctvSchedulesService: CctvSchedulesService) {}

  @Get()
  async findAll() {
    return this.cctvSchedulesService.findAll();
  }

  @Post()
  async create(@Body() data: CreateCctvScheduleDto) {
    return this.cctvSchedulesService.create(data);
  }

  @Patch(':uuid')
  async update(@Param('uuid') uuid: string, @Body() data: UpdateCctvScheduleDto) {
    return this.cctvSchedulesService.update(uuid, data);
  }

  @Delete(':uuid')
  async delete(@Param('uuid') uuid: string) {
    return this.cctvSchedulesService.delete(uuid);
  }
}
