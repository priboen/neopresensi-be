import { Test, TestingModule } from '@nestjs/testing';
import { FaceEmbeddingService } from './face-embedding.service';

describe('FaceEmbeddingService', () => {
  let service: FaceEmbeddingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FaceEmbeddingService],
    }).compile();

    service = module.get<FaceEmbeddingService>(FaceEmbeddingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
