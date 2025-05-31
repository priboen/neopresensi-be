import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard, RolesGuard } from 'src/common/guards';
import { CurrentUser, Roles } from 'src/common/decorators';
import { JwtPayload } from 'src/common/interfaces';
import { Role } from 'src/common/enums';
import {
  CreatePermissionDto,
  ResponseDto,
  UpdatePermissionStatusDto,
} from 'src/common/dto';
import { FileUploadInterceptor } from 'src/common/interceptor';
import { ConfigService } from '@nestjs/config';
import { getFullFileUrl } from 'src/common/utils';

@ApiTags('Permissions')
@UseGuards(JwtAuthGuard,RolesGuard)
@Controller('permissions')
export class PermissionsController {
  constructor(
    private readonly configService: ConfigService,
    private readonly permissionsService: PermissionsService,
  ) {}
  @Post()
  @Roles(Role.Guru)
  @ApiOperation({
    summary: 'Create permission with local file upload',
    description:
      'User with role "Guru" can create a permission request with an uploaded file.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['start_date', 'end_date', 'reason', 'file'],
      properties: {
        start_date: { type: 'string', format: 'date' },
        end_date: { type: 'string', format: 'date' },
        reason: { type: 'string' },
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @UseInterceptors(FileUploadInterceptor)
  async createPermission(
    @CurrentUser() user: JwtPayload,
    @Body() createPermissionDto: CreatePermissionDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (!file)
      return new ResponseDto({
        statusCode: 400,
        message: 'File upload is required',
      });

    const filePath = file.path.replace(/\\/g, '/');
    const fileUrl = getFullFileUrl(filePath, this.configService);
    const startDate = new Date(createPermissionDto.start_date);
    const hasConflict = await this.permissionsService.hasOverlappingPermission(
      user.uuid,
      startDate,
    );
    if (hasConflict) {
      return new ResponseDto({
        statusCode: 400,
        message: 'Ada perizinan yang sudah diajukan pada tanggal ini',
      });
    }
    const countInMonth = await this.permissionsService.countPermissionsInMonth(
      user.uuid,
      startDate,
    );
    if (countInMonth >= 3) {
      return new ResponseDto({
        statusCode: 400,
        message: 'Batas maksimal perizinan setiap bulan adalah 3x pengajuan',
      });
    }
    return this.permissionsService.createPermission({
      ...createPermissionDto,
      user_uuid: user.uuid,
      file_url: fileUrl,
      start_date: startDate,
      end_date: new Date(createPermissionDto.end_date),
    });
  }

  @Get('this-month')
  @ApiOperation({
    summary: 'Get permissions of the current month for logged-in user',
    description:
      'Fetches all permissions for the current month for the user making the request.',
  })
  @ApiResponse({ status: 200, description: 'Permissions fetched successfully' })
  async getPermissionsThisMonth(@CurrentUser() user: JwtPayload) {
    return this.permissionsService.getPermissionsThisMonth(user.uuid);
  }

  @Patch(':uuid/status')
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Update permission status (admin only)' })
  @ApiResponse({ status: 200, description: 'Status updated successfully' })
  async updateStatus(
    @Param('uuid') uuid: string,
    @Body() dto: UpdatePermissionStatusDto,
  ) {
    return this.permissionsService.updateStatus(uuid, dto.status);
  }

  @Delete(':uuid')
  @Roles(Role.Guru)
  @ApiOperation({ summary: 'Delete own permission (guru only)' })
  @ApiResponse({ status: 200, description: 'Permission deleted successfully' })
  async deletePermission(
    @Param('uuid') uuid: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.permissionsService.deletePermission(uuid, user.uuid);
  }

  @Get(':uuid')
  @ApiOperation({ summary: 'Get permission details by UUID' })
  @ApiResponse({ status: 200, description: 'Permission details retrieved' })
  async getDetail(@Param('uuid') uuid: string) {
    return this.permissionsService.getDetail(uuid);
  }
}
