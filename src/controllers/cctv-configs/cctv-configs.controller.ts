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
import { CctvConfigsService } from './cctv-configs.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard, RolesGuard } from 'src/common/guards';
import { Roles } from 'src/common/decorators';
import { Role } from 'src/common/enums';
import { CreateCctvConfigsDto } from 'src/common/dto/data/create-cctv-configs.dto';
import { UpdateCctvConfigDto } from 'src/common/dto/data/update-cctv-config.dto';
import {
  ConfigNotFoundResponseDto,
  ConfigValidationErrorResponseDto,
  CreateConfigResponseDto,
  DeleteConfigResponseDto,
  ForbiddenResponse,
  GetAllConfigsResponseDto,
  InternalServerErrorResponse,
  UnauthorizedResponse,
  UpdateConfigResponseDto,
} from 'src/common/dto';

@ApiTags('CCTV Configurations')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Admin)
@Controller('cctv-configs')
export class CctvConfigsController {
  constructor(private readonly cctvConfigsService: CctvConfigsService) {}

  @Get()
  @ApiOperation({
    summary: 'Get All CCTV Configurations',
    description:
      'Fetch all CCTV configurations available in the system. This endpoint is accessible only to users with the Admin role.',
  })
  @ApiResponse({
    status: 200,
    description: 'CCTV configurations fetched successfully',
    type: GetAllConfigsResponseDto,
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
  async getAllCctv() {
    return this.cctvConfigsService.findAll();
  }

  @Post()
  @ApiOperation({
    summary: 'Create CCTV Configuration',
    description:
      'Create a new CCTV configuration. This endpoint is accessible only to users with the Admin role.',
  })
  @ApiResponse({
    status: 201,
    description: 'CCTV configuration created successfully',
    type: CreateConfigResponseDto,
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
  @ApiResponse({
    status: 400,
    description: 'Validation error',
    type: ConfigValidationErrorResponseDto,
  })
  async createCctvConfig(@Body() data: CreateCctvConfigsDto) {
    return this.cctvConfigsService.create(data);
  }

  @Patch(':uuid')
  @ApiOperation({
    summary: 'Update CCTV Configuration',
    description:
      'Update an existing CCTV configuration by UUID. This endpoint is accessible only to users with the Admin role.',
  })
  @ApiResponse({
    status: 200,
    description: 'CCTV configuration updated successfully',
    type: UpdateConfigResponseDto,
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
    status: 404,
    description: 'CCTV configuration not found',
    type: ConfigNotFoundResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error',
    type: ConfigValidationErrorResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: InternalServerErrorResponse,
  })
  async updateCctvConfig(
    @Body() data: UpdateCctvConfigDto,
    @Param('uuid') uuid: string,
  ) {
    return this.cctvConfigsService.update(uuid, data);
  }

  @Delete(':uuid')
  @ApiOperation({
    summary: 'Delete CCTV Configuration',
    description:
      'Delete a CCTV configuration by UUID. This endpoint is accessible only to users with the Admin role.',
  })
  @ApiResponse({
    status: 200,
    description: 'CCTV configuration deleted successfully',
    type: DeleteConfigResponseDto,
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
    status: 404,
    description: 'CCTV configuration not found',
    type: ConfigNotFoundResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: InternalServerErrorResponse,
  })
  async deleteCctvConfig(@Param('uuid') uuid: string) {
    return this.cctvConfigsService.delete(uuid);
  }
}
