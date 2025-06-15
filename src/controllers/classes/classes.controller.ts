import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ClassesService } from './classes.service';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard, RolesGuard } from 'src/common/guards';
import { Roles } from 'src/common/decorators';
import { Role } from 'src/common/enums';
import { CreateClassesDto } from 'src/common/dto/data/create-classes.dto';
import {
  ClassAlreadyExistsResponse,
  ClassesValidationErrorResponse,
  ClassNotFoundResponse,
  CreateClassResponse,
  DeleteClassResponse,
  ForbiddenResponse,
  GetAllClassesResponse,
  InternalServerErrorResponse,
  UnauthorizedResponse,
} from 'src/common/dto';

@ApiTags('Classes')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Admin)
@Controller('classes')
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Get()
  @ApiOperation({
    summary: 'Get All Classes',
    description:
      'Fetch all classes available in the system. This endpoint is accessible only to users with the Admin role.',
  })
  @ApiResponse({
    status: 200,
    description: 'Classes fetched successfully',
    type: GetAllClassesResponse,
  })
  @ApiResponse({
    status: 401,
    type: UnauthorizedResponse,
    description: 'Unauthorized access',
  })
  @ApiResponse({
    type: ForbiddenResponse,
    status: 403,
    description: 'Forbidden access',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: InternalServerErrorResponse,
  })
  async findAll() {
    return this.classesService.findAll();
  }

  @Post()
  @ApiOperation({
    summary: 'Create Class',
    description:
      'Create a new class with the specified grade and group. This endpoint is accessible only to users with the Admin role.',
  })
  @ApiResponse({
    status: 201,
    description: 'Class created successfully',
    type: CreateClassResponse,
  })
  @ApiResponse({
    status: 409,
    description: 'Class with this grade and group already exists',
    type: ClassAlreadyExistsResponse,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error',
    type: ClassesValidationErrorResponse,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: InternalServerErrorResponse,
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
  async create(@Body() data: CreateClassesDto) {
    return this.classesService.create(data);
  }

  @Delete(':uuid')
  @ApiOperation({
    summary: 'Delete Class',
    description:
      'Delete a class by its UUID. This endpoint is accessible only to users with the Admin role.',
  })
  @ApiResponse({
    status: 200,
    description: 'Class deleted successfully',
    type: DeleteClassResponse,
  })
  @ApiResponse({
    status: 404,
    description: 'Class not found',
    type: ClassNotFoundResponse,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: InternalServerErrorResponse,
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
  async delete(@Param('uuid') uuid: string) {
    return this.classesService.delete(uuid);
  }
}
