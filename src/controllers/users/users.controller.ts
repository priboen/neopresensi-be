import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  AdminUpdateDto,
  DeleteUserResponse,
  ForbiddenResponse,
  GetAllUserResponse,
  GetUserByIdResponse,
  GetUserProfileResponse,
  NotFoundResponse,
  UnauthorizedResponse,
  UpdateUserResponse,
  UserUpdateDto,
} from 'src/common/dto';
import { JwtAuthGuard, RolesGuard } from 'src/common/guards';
import { CurrentUser, Roles } from 'src/common/decorators';
import { JwtPayload } from 'src/common/interfaces';
import { Role } from 'src/common/enums';
import { FileUploadInterceptor } from 'src/common/interceptor';
import { getFullFileUrl } from 'src/common/utils';
import { ConfigService } from '@nestjs/config';

@ApiTags('User')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  @ApiOperation({
    summary: 'Mendapatkan semua data user',
    description: '🔐 Memerlukan role `admin`.',
  })
  @ApiResponse({
    type: GetAllUserResponse,
    status: 200,
    description: 'Semua data user berhasil ditemukan',
  })
  @ApiResponse({
    type: UnauthorizedResponse,
    status: 401,
    description: 'Unauthorized: Pengguna harus terautentikasi',
  })
  @ApiResponse({
    type: ForbiddenResponse,
    status: 403,
    description: 'Forbidden: Hanya bisa diakses oleh role admin',
  })
  @Get()
  @Roles(Role.Admin)
  getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @ApiOperation({
    summary: 'Data profil',
    description:
      '🔐 Memerlukan autentikasi. Mengambil data profil pengguna yang sedang login.',
  })
  @ApiResponse({
    type: GetUserProfileResponse,
    status: 200,
    description: 'Data user berhasil ditemukan',
  })
  @ApiResponse({
    type: UnauthorizedResponse,
    status: 401,
    description: 'Unauthorized: Pengguna harus terautentikasi',
  })
  @Get('profile')
  getProfile(@CurrentUser() user: JwtPayload) {
    return this.usersService.getProfile(user.uuid);
  }

  @ApiOperation({
    summary: 'Data user dengan identifikasi',
    description:
      '🔐 Memerlukan role `admin`. Mengambil pengguna dengan UUID, nama pengguna, atau email.',
  })
  @ApiResponse({
    type: GetUserByIdResponse,
    status: 200,
    description: 'Data user berhasil ditemukan',
  })
  @ApiResponse({
    type: UnauthorizedResponse,
    status: 401,
    description: 'Unauthorized: User harus terautentikasi',
  })
  @ApiResponse({
    type: ForbiddenResponse,
    status: 403,
    description: 'Forbidden: Hanya bisa diakses oleh role admin',
  })
  @Get(':identifier')
  @Roles(Role.Admin)
  getUserByIdentifier(@Param('identifier') identifier: string) {
    return this.usersService.findUserBySmartIdentifier(identifier);
  }

  @Delete('profile/photo')
  @ApiOperation({ summary: 'Hapus foto profil saat ini' })
  @ApiResponse({
    status: 200,
    description: 'Foto profil berhasil dihapus',
  })
  @ApiResponse({
    status: 404,
    description: 'Foto profil tidak ditemukan',
  })
  async deletePhoto(@CurrentUser() user: JwtPayload) {
    console.log('Deleting photo for user:', user.uuid);
    return this.usersService.deleteProfilePhoto(user.uuid);
  }

  @Patch('profile')
  @ApiOperation({
    summary: 'Mengubah profil pengguna sendiri',
    description:
      '🔐 Memerlukan autentikasi. Mengubah data profil pengguna yang sedang login.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        username: { type: 'string' },
        email: { type: 'string', format: 'email' },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    type: UpdateUserResponse,
    status: 200,
    description: 'Profile updated',
  })
  @ApiResponse({
    type: UnauthorizedResponse,
    status: 401,
    description: 'Unauthorized: User must be authenticated',
  })
  @UseInterceptors(FileUploadInterceptor)
  async updateOwnProfile(
    @CurrentUser() user: JwtPayload,
    @Body() dto: UserUpdateDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    let photoUrl: string | undefined;
    if (file) {
      const filePath = await this.usersService.uploadUserAvatar(file);
      photoUrl = getFullFileUrl(filePath, this.configService);
    }
    return this.usersService.updateProfile(user.uuid, dto, photoUrl);
  }

  @Patch(':identifier')
  @Roles(Role.Admin)
  @ApiOperation({
    summary: 'Memperbarui user dengan identifikasi',
    description: '🔐 Memerlukan role `admin`.',
  })
  @ApiResponse({
    type: UpdateUserResponse,
    status: 200,
    description: 'Data user berhasil diperbarui',
  })
  @ApiResponse({
    type: UnauthorizedResponse,
    status: 401,
    description: 'Unauthorized: User harus terautentikasi',
  })
  @ApiResponse({
    type: ForbiddenResponse,
    status: 403,
    description: 'Forbidden: Hanya bisa diakses oleh role admin',
  })
  updateUserByIdentifier(
    @Param('identifier') identifier: string,
    @Body() dto: AdminUpdateDto,
  ) {
    return this.usersService.updateUserByIdentifier(identifier, dto);
  }

  @Delete(':identifier')
  @Roles(Role.Admin)
  @ApiOperation({
    summary: 'Hapus user dengan identifikasi',
    description:
      '🔐 Memerlukan role `admin`. Bisa menghapus dengan UUID, Username atau Email',
  })
  @ApiResponse({
    type: DeleteUserResponse,
    status: 200,
    description: 'User berhasil dihapus',
  })
  @ApiResponse({
    type: UnauthorizedResponse,
    status: 401,
    description: 'Unauthorized: User harus terautentikasi',
  })
  @ApiResponse({
    type: ForbiddenResponse,
    status: 403,
    description: 'Forbidden: Hanya bisa diakses oleh role admin',
  })
  @ApiResponse({
    type: NotFoundResponse,
    status: 404,
    description:
      'User not found: Pengguna dengan identitas yang dimasukan tidak ditemukan.',
  })
  deleteUser(@Param('identifier') identifier: string) {
    return this.usersService.deleteProfile(identifier);
  }
}
