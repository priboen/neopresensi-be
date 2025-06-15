import { Module } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { PermissionsController } from './permissions.controller';
import { permissionProvider } from 'src/common/providers';

@Module({
  controllers: [PermissionsController],
  providers: [PermissionsService, permissionProvider],
})
export class PermissionsModule {}
