import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import {
  cctvConfigProvider,
  permissionProvider,
  userProvider,
} from 'src/common/providers';

@Module({
  controllers: [DashboardController],
  providers: [
    DashboardService,
    userProvider,
    cctvConfigProvider,
    permissionProvider,
  ],
})
export class DashboardModule {}
