import { Test, TestingModule } from '@nestjs/testing';
import { CctvSchedulesService } from './cctv-schedules.service';

describe('CctvSchedulesService', () => {
  let service: CctvSchedulesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CctvSchedulesService],
    }).compile();

    service = module.get<CctvSchedulesService>(CctvSchedulesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
