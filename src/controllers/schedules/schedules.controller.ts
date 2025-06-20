import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { CreateScheduleDto, GetSchedulesResponseDto } from 'src/common/dto';
import { ApiResponse } from '@nestjs/swagger';

@Controller('schedules')
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Get all schedules',
    type: GetSchedulesResponseDto
  })
  async findAll() {
    return this.schedulesService.findAll();
  }

  @Post()
  async createSchedule(@Body() data: CreateScheduleDto) {
    return this.schedulesService.create(data);
  }

  @Patch(':uuid')
  async updateSchedule(
    @Body() data: CreateScheduleDto,
    @Param('uuid') uuid: string,
  ) {
    return this.schedulesService.update(uuid, data);
  }

  @Delete(':uuid')
  async deleteSchedule(@Param('uuid') uuid: string) {
    return this.schedulesService.delete(uuid);
  }
}
