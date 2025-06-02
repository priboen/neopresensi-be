import { Test, TestingModule } from '@nestjs/testing';
import { FaceEmbeddingController } from './face-embedding.controller';
import { FaceEmbeddingService } from './face-embedding.service';

describe('FaceEmbeddingController', () => {
  let controller: FaceEmbeddingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FaceEmbeddingController],
      providers: [FaceEmbeddingService],
    }).compile();

    controller = module.get<FaceEmbeddingController>(FaceEmbeddingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
