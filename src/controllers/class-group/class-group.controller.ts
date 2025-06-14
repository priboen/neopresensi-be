import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ClassGroupService } from './class-group.service';
import { ApiCreatedResponse, ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard, RolesGuard } from 'src/common/guards';
import { Roles } from 'src/common/decorators';
import { Role } from 'src/common/enums';
import {
  CreateGroupDto,
  ForbiddenResponse,
  UnauthorizedResponse,
} from 'src/common/dto';
import {
  ClassGroupAlreadyExistsResponse,
  ClassGroupNotFoundResponse,
  CreateClassGroupResponse,
  DeleteClassGroupResponse,
  GetAllClassGroupsResponse,
  ValidationErrorResponse,
} from 'src/common/dto/responses/class-group';

@ApiTags('Group Classes')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Admin)
@Controller('class-group')
export class ClassGroupController {
  constructor(private readonly classGroupService: ClassGroupService) {}

  @Get()
  @ApiOperation({
    summary: 'Get All Class Groups',
    description:
      'Fetch all class groups available in the system. This endpoint is accessible only to users with the Admin role.',
  })
  @ApiResponse({
    status: 200,
    description: 'Class groups fetched successfully',
    type: GetAllClassGroupsResponse,
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
  @ApiHeader({
    name: 'Authorization',
    description: 'JWT token for authentication',
    required: true,
  })
  async getAllClassGroups() {
    return this.classGroupService.findAll();
  }

  @Post()
  @ApiOperation({
    summary: 'Create Class Group',
    description:
      'Create a new class group with the provided details. This endpoint is accessible only to users with the Admin role.',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'JWT token for authentication',
    required: true,
  })
  @ApiResponse({
    status: 201,
    description: 'Class group created successfully',
    type: CreateClassGroupResponse,
  })
  @ApiResponse({
    status: 400,
    description: 'Class group with this name already exists',
    type: ClassGroupAlreadyExistsResponse,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error',
    type: ValidationErrorResponse,
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
    example: {
      statusCode: 500,
      message: 'An error occurred while creating the class group',
    },
  })
  async createClassGroup(@Body() data: CreateGroupDto) {
    return this.classGroupService.create(data);
  }

  @Delete(':uuid')
  @ApiHeader({
    name: 'Authorization',
    description: 'JWT token for authentication',
    required: true,
  })
  @ApiOperation({
    summary: 'Delete Class Group',
    description:
      'Delete a class group by its UUID. This endpoint is accessible only to users with the Admin role.',
  })
  @ApiResponse({
    status: 200,
    description: 'Class group deleted successfully',
    type: DeleteClassGroupResponse,
  })
  @ApiResponse({
    status: 404,
    description: 'Class group not found',
    type: ClassGroupNotFoundResponse,
  })
  async deleteClassGroup(@Param('uuid') uuid: string) {
    return this.classGroupService.delete(uuid);
  }
}
