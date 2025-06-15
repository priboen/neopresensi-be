import { Module } from '@nestjs/common';
import { ClassesService } from './classes.service';
import { ClassesController } from './classes.controller';
import { classProvider } from 'src/common/providers';

@Module({
  controllers: [ClassesController],
  providers: [ClassesService, classProvider],
})
export class ClassesModule {}
