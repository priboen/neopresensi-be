import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { SubjectsService } from './subjects.service';
import {
  CreateSubjectDto,
  ForbiddenResponse,
  GetSubjectResponseDto,
  InternalServerErrorResponse,
  UnauthorizedResponse,
} from 'src/common/dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard, RolesGuard } from 'src/common/guards';
import { Roles } from 'src/common/decorators';
import { Role } from 'src/common/enums';

@ApiTags('Subjects')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Admin)
@Controller('subjects')
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all subjects',
    description: 'Retrieves a list of all subjects. Requires admin role.',
  })
  @ApiResponse({
    status: 200,
    description: 'Subjects fetched successfully',
    type: GetSubjectResponseDto,
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
    return this.subjectsService.findAll();
  }

  @Post()
  @ApiOperation({
    summary: 'Create a new subject',
    description:
      'Creates a new subject with the provided data. Requires admin role.',
  })
  async create(@Body() data: CreateSubjectDto) {
    return this.subjectsService.create(data);
  }

  @Delete(':uuid')
  @ApiOperation({
    summary: 'Delete a subject',
    description: 'Deletes a subject by its UUID. Requires admin role.',
  })
  async deleteSubject(@Param('uuid') uuid: string) {
    return this.subjectsService.deleteSubject(uuid);
  }
}
