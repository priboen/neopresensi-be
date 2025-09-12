import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { AttendanceCreateDto } from 'src/common/dto/data/attendance-create.dto';
import { AdminAttendanceCreateDto } from 'src/common/dto/data/admin-attendance-create.dto';
import { CurrentUser } from 'src/common/decorators';
import { JwtPayload } from 'src/common/interfaces';
import { UserAttendanceDto } from 'src/common/dto/data/user-attendance.dto';
import { JwtAuthGuard } from 'src/common/guards';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post()
  async create(@Body() attendanceDto: AttendanceCreateDto) {
    return this.attendanceService.createAttendance(attendanceDto);
  }

  @Get()
  async findAll() {
    return this.attendanceService.getAllAttendances();
  }

  @Post('/admin')
  async createAdminAttendance(
    @Body() adminAttendanceDto: AdminAttendanceCreateDto,
  ) {
    return this.attendanceService.createAttendanceForAdmin(adminAttendanceDto);
  }

  @Get('/user/:date')
  async getUserAttendanceByDateForAdmin(@Query('date') date: string) {
    return this.attendanceService.getAttendanceByDate(date);
  }

  @Get('/user')
  @UseGuards(JwtAuthGuard)
  async getUserAttendanceByDate(
    @CurrentUser() user: JwtPayload,
    @Query() userAttendanceDto: UserAttendanceDto,
  ) {
    return this.attendanceService.getUserAttendanceByDate(
      user.uuid,
      userAttendanceDto.date,
    );
  }
}
