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
import { TeacherAssignmentsService } from './teacher-assignments.service';
import {
  CreateTeacherAssignmentDto,
  CreateTeacherAssignmentResponseDto,
  DeleteTeacherAssignmentResponseDto,
  ForbiddenResponse,
  GetTeacherAssignmentsResponseDto,
  InternalServerErrorResponse,
  UnauthorizedResponse,
  UpdateTeacherAssignmentDto,
} from 'src/common/dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard, RolesGuard } from 'src/common/guards';
import { Roles } from 'src/common/decorators';
import { Role } from 'src/common/enums';

@ApiTags('Teacher Assignments')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Admin)
@Controller('teacher-assignments')
export class TeacherAssignmentsController {
  constructor(
    private readonly teacherAssignmentsService: TeacherAssignmentsService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Get all teacher assignments',
    description:
      'Retrieves a list of all teacher assignments. Requires admin role.',
  })
  @ApiResponse({
    status: 200,
    description: 'Teacher assignments fetched successfully',
    type: GetTeacherAssignmentsResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. Only admins can access this endpoint.',
    type: ForbiddenResponse,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Please provide a valid token.',
    type: UnauthorizedResponse,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: InternalServerErrorResponse,
  })
  async findAll() {
    return this.teacherAssignmentsService.findAll();
  }

  @Post()
  @ApiOperation({
    summary: 'Create a new teacher assignment',
    description: 'Creates a new teacher assignment. Requires admin role.',
  })
  @ApiResponse({
    status: 201,
    description: 'Teacher assignment created successfully',
    type: CreateTeacherAssignmentResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. Only admins can access this endpoint.',
    type: ForbiddenResponse,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Please provide a valid token.',
    type: UnauthorizedResponse,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: InternalServerErrorResponse,
  })
  async create(@Body() data: CreateTeacherAssignmentDto) {
    return this.teacherAssignmentsService.create(data);
  }

  @Patch(':uuid')
  @ApiOperation({
    summary: 'Update a teacher assignment',
    description: 'Updates an existing teacher assignment. Requires admin role.',
  })
  @ApiResponse({
    status: 200,
    description: 'Teacher assignment updated successfully',
    type: UpdateTeacherAssignmentDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. Only admins can access this endpoint.',
    type: ForbiddenResponse,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Please provide a valid token.',
    type: UnauthorizedResponse,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: InternalServerErrorResponse,
  })
  async update(
    @Body() data: UpdateTeacherAssignmentDto,
    @Param('uuid') uuid: string,
  ) {
    return this.teacherAssignmentsService.update(uuid, data);
  }

  @Delete(':uuid')
  @ApiOperation({
    summary: 'Delete a teacher assignment',
    description:
      'Deletes a teacher assignment by its UUID. Requires admin role.',
  })
  @ApiResponse({
    status: 200,
    description: 'Teacher assignment deleted successfully',
    type: DeleteTeacherAssignmentResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. Only admins can access this endpoint.',
    type: ForbiddenResponse,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Please provide a valid token.',
    type: UnauthorizedResponse,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: InternalServerErrorResponse,
  })
  async delete(@Param('uuid') uuid: string) {
    return this.teacherAssignmentsService.deleteTeacher(uuid);
  }
}
