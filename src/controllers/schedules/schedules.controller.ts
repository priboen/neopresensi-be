import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { CreateScheduleDto, GetSchedulesResponseDto } from 'src/common/dto';
import { ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards';
import { CurrentUser } from 'src/common/decorators';
import { JwtPayload } from 'src/common/interfaces';

@Controller('schedules')
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Get all schedules',
    type: GetSchedulesResponseDto,
  })
  async findAll() {
    return this.schedulesService.findAll();
  }

  @Get('/:day')
  @UseGuards(JwtAuthGuard)
  async getSchedulesByDate(
    @CurrentUser() user: JwtPayload,
    @Param('day') day: string,
  ) {
    return this.schedulesService.getScheduleByDay(user.uuid, day);
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
