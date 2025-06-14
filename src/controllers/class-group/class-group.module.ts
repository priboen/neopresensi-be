import { Module } from '@nestjs/common';
import { ClassGroupService } from './class-group.service';
import { ClassGroupController } from './class-group.controller';
import { classGroupProvider } from 'src/common/providers';

@Module({
  controllers: [ClassGroupController],
  providers: [ClassGroupService, classGroupProvider],
})
export class ClassGroupModule {}
