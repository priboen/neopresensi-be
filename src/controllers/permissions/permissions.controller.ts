import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
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
import { Role, PermissionStatus } from 'src/common/enums';
import {
  BadRequestResponse,
  CreatePermissionDto,
  CreatePermissionResponse,
  DeletePermissionResponse,
  ForbiddenResponse,
  GetAllPermissionResponse,
  GetPermissionDetailResponse,
  GetPermissionThisMonthResponse,
  InternalServerErrorResponse,
  NotFoundResponse,
  ResponseDto,
  UnauthorizedResponse,
  UpdatePermissionStatusDto,
  UpdatePermissionStatusResponse,
} from 'src/common/dto';
import { FileUploadInterceptor } from 'src/common/interceptor';
import { ConfigService } from '@nestjs/config';
import { getFullFileUrl } from 'src/common/utils';

@ApiTags('Permissions')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('permissions')
export class PermissionsController {
  constructor(
    private readonly configService: ConfigService,
    private readonly permissionsService: PermissionsService,
  ) {}
  @Post()
  @Roles(Role.Teacher)
  @ApiOperation({
    summary: 'Buat pengajuan izin (Guru)',
    description:
      'Endpoint ini digunakan oleh pengguna dengan peran "Guru" untuk membuat pengajuan izin baru dengan mengunggah file pendukung seperti gambar atau PDF.',
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
  @ApiResponse({
    type: CreatePermissionResponse,
    status: 201,
    description: 'Permission created successfully',
  })
  @ApiResponse({
    type: BadRequestResponse,
    status: 400,
    description: 'Invalid input or file missing',
  })
  @ApiResponse({
    type: UnauthorizedResponse,
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    type: ForbiddenResponse,
    status: 403,
    description: 'Access restricted to Guru role',
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

    const filePath = await this.permissionsService.uploadFileToPermissions(file);
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
      user_id: user.uuid,
      file_url: fileUrl,
      start_date: startDate,
      end_date: new Date(createPermissionDto.end_date),
    });
  }

  @Roles(Role.Admin)
  @Get()
  @ApiOperation({
    summary: 'Lihat semua data perizinan (Admin)',
    description:
      'Admin dapat melihat semua data perizinan, dengan filter status dan bulan.',
  })
  @ApiResponse({
    status: 200,
    description: 'Data perizinan berhasil diambil',
    type: GetAllPermissionResponse,
  })
  @ApiResponse({ type: UnauthorizedResponse, status: 401 })
  @ApiResponse({ type: ForbiddenResponse, status: 403 })
  async getAllPermissionsForAdmin(
    @Query('status') status?: PermissionStatus,
    @Query('month') month?: string,
  ) {
    return this.permissionsService.getAllPermissions({ status, month });
  }

  @Get('this-month')
  @ApiOperation({
    summary: 'Lihat izin bulan ini',
    description:
      'Mengambil seluruh data izin milik pengguna yang sedang login untuk periode bulan berjalan berdasarkan tanggal mulai izin.',
  })
  @ApiResponse({
    type: GetPermissionThisMonthResponse,
    status: 200,
    description: 'Permissions for this month retrieved successfully',
  })
  @ApiResponse({
    type: UnauthorizedResponse,
    status: 401,
    description: 'Unauthorized',
  })
  async getPermissionsThisMonth(@CurrentUser() user: JwtPayload) {
    return this.permissionsService.getPermissionsThisMonth(user.uuid);
  }

  @Patch(':uuid')
  @Roles(Role.Admin)
  @ApiOperation({
    summary: 'Ubah status izin (Admin)',
    description:
      'Digunakan oleh admin untuk memperbarui status dari pengajuan izin tertentu, misalnya menjadi "approved" atau "rejected".',
  })
  @ApiResponse({
    type: UpdatePermissionStatusResponse,
    status: 200,
    description: 'Permission status updated successfully',
  })
  @ApiResponse({
    type: NotFoundResponse,
    status: 404,
    description: 'Permission not found',
  })
  @ApiResponse({
    type: UnauthorizedResponse,
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    type: ForbiddenResponse,
    status: 403,
    description: 'Only admins allowed',
  })
  @ApiResponse({
    type: InternalServerErrorResponse,
    status: 500,
    description: 'Unexpected error occurred',
  })
  async updateStatus(
    @Param('uuid') uuid: string,
    @Body() dto: UpdatePermissionStatusDto,
  ) {
    return this.permissionsService.updateStatus(uuid, dto.status);
  }

  @Delete(':uuid')
  @Roles(Role.Teacher)
  @ApiOperation({
    summary: 'Hapus pengajuan izin (Guru)',
    description:
      'Pengguna dengan peran "Guru" dapat menghapus pengajuan izin miliknya sendiri. File pendukung yang diunggah juga akan dihapus dari penyimpanan lokal.',
  })
  @ApiResponse({
    type: DeletePermissionResponse,
    status: 200,
    description: 'Permission deleted with file',
  })
  @ApiResponse({
    type: NotFoundResponse,
    status: 404,
    description: 'Permission not found',
  })
  @ApiResponse({
    type: UnauthorizedResponse,
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    type: ForbiddenResponse,
    status: 403,
    description: "Cannot delete others' permissions",
  })
  async deletePermission(
    @Param('uuid') uuid: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.permissionsService.deletePermission(uuid, user.uuid);
  }

  @Get(':uuid')
  @ApiOperation({
    summary: 'Lihat detail izin berdasarkan UUID',
    description:
      'Mengambil informasi lengkap dari sebuah pengajuan izin berdasarkan UUID-nya. Cocok digunakan untuk menampilkan detail dalam halaman detail pengajuan.',
  })
  @ApiResponse({
    type: GetPermissionDetailResponse,
    status: 200,
    description: 'Permission details retrieved successfully',
  })
  @ApiResponse({
    type: NotFoundResponse,
    status: 404,
    description: 'Permission not found',
  })
  @ApiResponse({
    type: UnauthorizedResponse,
    status: 401,
    description: 'Unauthorized',
  })
  async getDetail(@Param('uuid') uuid: string) {
    return this.permissionsService.getDetail(uuid);
  }
}
