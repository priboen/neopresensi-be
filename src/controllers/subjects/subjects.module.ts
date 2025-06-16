import { Module } from '@nestjs/common';
import { SubjectsService } from './subjects.service';
import { SubjectsController } from './subjects.controller';
import { subjectProvider } from 'src/common/providers';

@Module({
  controllers: [SubjectsController],
  providers: [SubjectsService, subjectProvider],
})
export class SubjectsModule {}
