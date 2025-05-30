import { Inject, Injectable } from '@nestjs/common';
import { Op } from 'sequelize';
import { ResponseDto } from 'src/common/dto';
import { PermissionStatus } from 'src/common/enums';
import { Permission } from 'src/common/models';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class PermissionsService {
  constructor(
    @Inject('PERMISSION_REPOSITORY') private readonly permissionRepository: any,
  ) {}

  async uploadFileToStorage(file: Express.Multer.File): Promise<string> {
    return file.path.replace(/\\/g, '/');
  }

  async hasOverlappingPermission(
    userUuid: string,
    startDate: Date,
  ): Promise<boolean> {
    try {
      const count = await this.permissionRepository.count({
        where: {
          user_uuid: userUuid,
          start_date: startDate,
          status: ['pending', 'approved'],
        },
      });
      return count > 0;
    } catch (error) {
      throw new ResponseDto({
        statusCode: 500,
        message:
          'Terjadi kesalahan saat memeriksa izin yang tumpang tindih: ' +
          error.message,
      });
    }
  }

  async countPermissionsInMonth(userUuid: string, date: Date): Promise<number> {
    try {
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const startOfMonth = new Date(year, month - 1, 1);
      const endOfMonth = new Date(year, month, 0);

      const count = await this.permissionRepository.count({
        where: {
          user_uuid: userUuid,
          start_date: {
            [Op.between]: [startOfMonth, endOfMonth],
          },
        },
      });
      return count;
    } catch (error) {
      throw new ResponseDto({
        statusCode: 500,
        message:
          'Terjadi kesalahan saat menghitung izin di bulan tersebut: ' +
          error.message,
      });
    }
  }

  async createPermission(
    data: Partial<Permission>,
  ): Promise<ResponseDto<Permission>> {
    try {
      const permission = await this.permissionRepository.create(data);
      return new ResponseDto({
        statusCode: 201,
        message: 'Permission created successfully',
        data: permission,
      });
    } catch (error) {
      return new ResponseDto({
        statusCode: 500,
        message:
          'An error occurred while creating the permission : ' + error.message,
      });
    }
  }

  async getPermissionsThisMonth(
    userUuid: string,
  ): Promise<ResponseDto<Permission[]>> {
    try {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;

      const startOfMonth = new Date(year, month - 1, 1);
      const endOfMonth = new Date(year, month, 0);

      const permissions = await this.permissionRepository.findAll({
        where: {
          user_uuid: userUuid,
          start_date: {
            [Op.between]: [startOfMonth, endOfMonth],
          },
        },
        order: [['start_date', 'ASC']],
      });

      return new ResponseDto<Permission[]>({
        statusCode: 200,
        message: 'Permissions fetched for this month',
        data: permissions,
      });
    } catch (error) {
      return new ResponseDto({
        statusCode: 500,
        message:
          'Terjadi kesalahan saat mengambil data izin untuk bulan ini: ' +
          error.message,
      });
    }
  }

  async updateStatus(
    uuid: string,
    status: PermissionStatus,
  ): Promise<ResponseDto<Permission>> {
    try {
      await this.permissionRepository.update({ status }, { where: { uuid } });
      const updatedPermission = await this.permissionRepository.findOne({
        where: { uuid },
        attributes: [
          'uuid',
          'user_uuid',
          'start_date',
          'end_date',
          'reason',
          'status',
          'file_url',
          'createdAt',
          'updatedAt',
        ],
      });
      return new ResponseDto({
        statusCode: 200,
        message: 'Status perizinan berhasil diubah',
        data: updatedPermission,
      });
    } catch (error) {
      return new ResponseDto<Permission>({
        statusCode: 500,
        message:
          'Terjadi kesalahan saat mengubah status perizinan: ' + error.message,
      });
    }
  }

  async deletePermission(
    uuid: string,
    userUuid: string,
  ): Promise<ResponseDto<void>> {
    try {
      const permission = await this.permissionRepository.findOne({
        where: { uuid },
      });
      if (!permission) {
        return new ResponseDto<void>({
          statusCode: 404,
          message: 'Data izin tidak ditemukan',
        });
      }

      if (permission.user_uuid !== userUuid) {
        return new ResponseDto<void>({
          statusCode: 403,
          message: 'Anda tidak memiliki izin untuk menghapus data ini',
        });
      }

      // Hapus file fisik
      if (permission.file_url) {
        // Extract path lokal, misal hapus 'http://localhost:4000' dari URL
        const filePath = permission.file_url.replace(/^http:\/\/[^\/]+/, '');
        // Buat path absolut sesuai lokasi uploads di project
        const fullPath = path.join(process.cwd(), filePath);

        // Cek file ada dan hapus
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
      }

      // Hapus data permission dari DB
      await permission.destroy();

      return new ResponseDto<void>({
        statusCode: 200,
        message: 'Perizinan berhasil dihapus beserta file terkait',
      });
    } catch (error) {
      return new ResponseDto<void>({
        statusCode: 500,
        message: 'Terjadi kesalahan saat menghapus perizinan: ' + error.message,
      });
    }
  }

  async getDetail(uuid: string): Promise<ResponseDto<Permission>> {
    const permission = await this.permissionRepository.findOne({
      where: { uuid },
    });
    try {
      if (!permission) {
        return new ResponseDto<Permission>({
          statusCode: 404,
          message: 'Data perizinan tidak ditemukan',
        });
      }
      return new ResponseDto<Permission>({
        statusCode: 200,
        message: 'Detail perizinan berhasil diambil',
        data: permission,
      });
    } catch (error) {
      return new ResponseDto<Permission>({
        statusCode: 500,
        message:
          'Terjadi kesalahan saat mengambil detail perizinan: ' + error.message,
      });
    }
  }
}
