import { Module } from '@nestjs/common';
import { FaceEmbeddingService } from './face-embedding.service';
import { FaceEmbeddingController } from './face-embedding.controller';
import { userProvider } from 'src/common/providers';

@Module({
  controllers: [FaceEmbeddingController],
  providers: [FaceEmbeddingService, userProvider],
})
export class FaceEmbeddingModule {}
