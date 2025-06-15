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
    @Inject('PERMISSION_REPOSITORY')
    private readonly permissionRepository: typeof Permission,
  ) {}

  async uploadFileToPermissions(file: Express.Multer.File): Promise<string> {
    const destFolder = path.join(process.cwd(), 'uploads/permissions');
    if (!fs.existsSync(destFolder)) {
      fs.mkdirSync(destFolder, { recursive: true });
    }
    const newPath = path.join(destFolder, path.basename(file.path));
    fs.renameSync(file.path, newPath);
    return `uploads/permissions/${path.basename(file.path)}`;
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

  async getAllPermissions(filters: {
    status?: PermissionStatus;
    month?: string;
  }): Promise<ResponseDto<Permission[]>> {
    try {
      const where: any = {};
      if (filters.status) {
        where.status = filters.status;
      }
      if (filters.month) {
        const [year, month] = filters.month.split('-').map(Number);
        if (!year || !month || month < 1 || month > 12) {
          return new ResponseDto({
            statusCode: 400,
            message: 'Format bulan tidak valid. Gunakan format YYYY-MM',
          });
        }
        const startOfMonth = new Date(year, month - 1, 1);
        const endOfMonth = new Date(year, month, 0);
        where.start_date = {
          [Op.between]: [startOfMonth, endOfMonth],
        };
      }
      const permissions = await this.permissionRepository.findAll({
        where,
        include: [
          {
            association: 'user',
            attributes: ['uuid', 'name', 'photo_url'],
          },
        ],
        order: [['createdAt', 'DESC']],
      });
      return new ResponseDto<Permission[]>({
        statusCode: 200,
        message: 'Permissions retrieved successfully',
        data: permissions,
      });
    } catch (error) {
      return new ResponseDto({
        statusCode: 500,
        message:
          'An error occurred while retrieving permissions: ' + error.message,
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
      return new ResponseDto<Permission>({
        statusCode: 200,
        message: 'Status perizinan berhasil diubah',
        data: updatedPermission as Permission,
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
    userUuidFromJwt: string,
  ): Promise<ResponseDto<Permission>> {
    try {
      const permission = await this.permissionRepository.findOne({
        where: { uuid },
        raw: false,
      });

      if (!permission) {
        return new ResponseDto({
          statusCode: 404,
          message: 'Data izin tidak ditemukan',
        });
      }
      const actualUserUuid = permission.getDataValue('user_uuid');
      if (actualUserUuid !== userUuidFromJwt) {
        return new ResponseDto({
          statusCode: 403,
          message: 'Anda tidak memiliki izin untuk menghapus data ini',
        });
      }
      const fileUpload = permission.getDataValue('file_url');
      if (fileUpload) {
        const filePath = fileUpload.replace(/^https?:\/\/[^\/]+/, '');
        const fullPath = path.join(process.cwd(), filePath);
        console.log('Full file path to delete:', fullPath);
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
      }
      await permission.destroy();
      return new ResponseDto({
        statusCode: 200,
        message: 'Perizinan berhasil dihapus beserta file terkait',
      });
    } catch (error) {
      return new ResponseDto({
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
