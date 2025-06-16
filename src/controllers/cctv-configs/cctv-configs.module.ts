import { Module } from '@nestjs/common';
import { CctvConfigsService } from './cctv-configs.service';
import { CctvConfigsController } from './cctv-configs.controller';
import { cctvConfigProvider } from 'src/common/providers';

@Module({
  controllers: [CctvConfigsController],
  providers: [CctvConfigsService, cctvConfigProvider],
})
export class CctvConfigsModule {}
