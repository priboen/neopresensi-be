import { Module } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { PermissionsController } from './permissions.controller';
import { PermissionProvider } from 'src/common/providers';

@Module({
  controllers: [PermissionsController],
  providers: [PermissionsService, PermissionProvider],
})
export class PermissionsModule {}
