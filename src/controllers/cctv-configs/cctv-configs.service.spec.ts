import { Test, TestingModule } from '@nestjs/testing';
import { CctvConfigsService } from './cctv-configs.service';

describe('CctvConfigsService', () => {
  let service: CctvConfigsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CctvConfigsService],
    }).compile();

    service = module.get<CctvConfigsService>(CctvConfigsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
