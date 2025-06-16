import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { CctvSchedulesService } from './cctv-schedules.service';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard, RolesGuard } from 'src/common/guards';
import { Role } from 'src/common/enums';
import { Roles } from 'src/common/decorators';
import {
  CreateCctvScheduleDto,
  ForbiddenResponse,
  InternalServerErrorResponse,
} from 'src/common/dto';
import { UpdateCctvScheduleDto } from 'src/common/dto/data/update-cctv-schedule.dto';
import {
  CreateCctvScheduleResponse,
  DeleteCctvScheduleResponse,
  GetCctvScheduleResponse,
  UpdateCctvScheduleResponse,
} from 'src/common/dto/responses/cctv-schedule/cctv-schedule-response.dto';

@ApiTags('CCTV Schedules')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Admin)
@Controller('cctv-schedules')
export class CctvSchedulesController {
  constructor(private readonly cctvSchedulesService: CctvSchedulesService) {}

  @Get()
  @ApiOperation({
    summary: 'Retrieve all CCTV schedules',
    description:
      'This endpoint retrieves all CCTV schedules from the database.',
  })
  @ApiResponse({
    status: 200,
    description: 'CCTV schedules retrieved successfully',
    type: GetCctvScheduleResponse,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized access',
    type: UnauthorizedException,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden access',
    type: ForbiddenResponse,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: InternalServerErrorResponse,
  })
  async findAll() {
    return this.cctvSchedulesService.findAll();
  }

  @Post()
  @ApiOperation({
    summary: 'Create a new CCTV schedule',
    description: 'This endpoint allows the creation of a new CCTV schedule.',
  })
  @ApiResponse({
    status: 201,
    description: 'CCTV schedule created successfully',
    type: CreateCctvScheduleResponse,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized access',
    type: UnauthorizedException,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden access',
    type: ForbiddenResponse,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: InternalServerErrorResponse,
  })
  async create(@Body() data: CreateCctvScheduleDto) {
    return this.cctvSchedulesService.create(data);
  }

  @Patch(':uuid')
  @ApiOperation({
    summary: 'Update an existing CCTV schedule',
    description:
      'This endpoint allows the update of an existing CCTV schedule by its UUID.',
  })
  @ApiResponse({
    status: 200,
    description: 'CCTV schedule updated successfully',
    type: UpdateCctvScheduleResponse,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized access',
    type: UnauthorizedException,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden access',
    type: ForbiddenResponse,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: InternalServerErrorResponse,
  })
  async update(
    @Param('uuid') uuid: string,
    @Body() data: UpdateCctvScheduleDto,
  ) {
    return this.cctvSchedulesService.update(uuid, data);
  }

  @Delete(':uuid')
  @ApiOperation({
    summary: 'Delete a CCTV schedule',
    description:
      'This endpoint allows the deletion of a CCTV schedule by its UUID.',
  })
  @ApiResponse({
    status: 200,
    description: 'CCTV schedule deleted successfully',
    type: DeleteCctvScheduleResponse,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized access',
    type: UnauthorizedException,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden access',
    type: ForbiddenResponse,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: InternalServerErrorResponse,
  })
  async delete(@Param('uuid') uuid: string) {
    return this.cctvSchedulesService.delete(uuid);
  }
}
