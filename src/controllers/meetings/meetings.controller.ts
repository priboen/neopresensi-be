import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { MeetingsService } from './meetings.service';
import { CreateMeetingDto, UpdateMeetingDto } from 'src/common/dto';

@Controller('meetings')
export class MeetingsController {
  constructor(private readonly meetingsService: MeetingsService) {}

  @Get()
  async findAll() {
    return this.meetingsService.findAll();
  }

  @Post()
  async createMeeting(@Body() data: CreateMeetingDto) {
    return this.meetingsService.create(data);
  }

  @Patch(':uuid')
  async updateMeeting(
    @Body() data: UpdateMeetingDto,
    @Param('uuid') uuid: string,
  ) {
    return this.meetingsService.update(uuid, data);
  }

  @Delete(':uuid')
  async deleteMeeting(@Param('uuid') uuid: string) {
    return this.meetingsService.delete(uuid);
  }
}
