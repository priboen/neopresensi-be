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
import { MeetingsService } from './meetings.service';
import {
  CreateMeetingDto,
  CreateMeetingResponseDto,
  DeleteMeetingResponseDto,
  ForbiddenResponse,
  GetMeetingResponseDto,
  InternalServerErrorResponse,
  UnauthorizedResponse,
  UpdateMeetingDto,
  UpdateMeetingResponseDto,
} from 'src/common/dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard, RolesGuard } from 'src/common/guards';
import { Roles } from 'src/common/decorators';
import { Role } from 'src/common/enums';

@ApiTags('Meetings')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Admin)
@Controller('meetings')
export class MeetingsController {
  constructor(private readonly meetingsService: MeetingsService) {}

  @Get()
  @ApiOperation({
    summary: 'Retrieve all meetings',
    description: 'This endpoint retrieves all meetings from the database.',
  })
  @ApiResponse({
    status: 200,
    description: 'Meetings retrieved successfully',
    type: GetMeetingResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized access',
    type: UnauthorizedResponse,
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
    return this.meetingsService.findAll();
  }

  @Post()
  @ApiOperation({
    summary: 'Create a new meeting',
    description: 'This endpoint allows the creation of a new meeting.',
  })
  @ApiResponse({
    status: 201,
    description: 'Meeting created successfully',
    type: CreateMeetingResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized access',
    type: UnauthorizedResponse,
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
  async createMeeting(@Body() data: CreateMeetingDto) {
    return this.meetingsService.create(data);
  }

  @Patch(':uuid')
  @ApiOperation({
    summary: 'Update a meeting',
    description: 'This endpoint allows the update of an existing meeting by its UUID.',
  })
  @ApiResponse({
    status: 200,
    description: 'Meeting updated successfully',
    type: UpdateMeetingResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized access',
    type: UnauthorizedResponse,
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
  async updateMeeting(
    @Body() data: UpdateMeetingDto,
    @Param('uuid') uuid: string,
  ) {
    return this.meetingsService.update(uuid, data);
  }

  @Delete(':uuid')
  @ApiOperation({
    summary: 'Delete a meeting',
    description: 'This endpoint allows the deletion of a meeting by its UUID.',
  })
  @ApiResponse({
    status: 200,
    description: 'Meeting deleted successfully',
    type: DeleteMeetingResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized access',
    type: UnauthorizedResponse,
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
  async deleteMeeting(@Param('uuid') uuid: string) {
    return this.meetingsService.delete(uuid);
  }
}
