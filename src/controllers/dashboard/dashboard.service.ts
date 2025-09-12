import { Inject, Injectable } from '@nestjs/common';
import { ResponseDto } from 'src/common/dto';
import { CCTVConfig, Permission, User } from 'src/common/models';

@Injectable()
export class DashboardService {
  constructor(
    @Inject('USER_REPOSITORY') private readonly userRepository: typeof User,
    @Inject('CCTV_CONFIG_REPOSITORY')
    private readonly cctvRepository: typeof CCTVConfig,
    @Inject('PERMISSION_REPOSITORY')
    private readonly permissionRepository: typeof Permission,
  ) {}

  async getDashboardData(): Promise<ResponseDto<any>> {
    try {
      const userCount = await this.userRepository.count();
      const cctvCount = await this.cctvRepository.count();
      const permissionCount = await this.permissionRepository.count();
      const permissionStatusCount = await this.permissionRepository.count({
        where: {
          status: ['pending'],
        },
      });

      const dashboardData = {
        userCount,
        cctvCount,
        permissionCount,
        permissionStatusCount,
      };

      return new ResponseDto({
        statusCode: 200,
        message: 'Dashboard data retrieved successfully',
        data: dashboardData,
      });
    } catch (error) {
      return new ResponseDto({
        statusCode: 500,
        message: 'Error retrieving dashboard data: ' + error.message,
      });
    }
  }
}
